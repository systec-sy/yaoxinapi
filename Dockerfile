FROM oven/bun:1@sha256:0733e50325078969732ebe3b15ce4c4be5082f18c4ac1a0f0ca4839c2e4e42a7 AS builder

WORKDIR /build
COPY web/default/package.json .
COPY web/default/bun.lock .
RUN bun install
COPY ./web/default .
COPY ./VERSION .
RUN DISABLE_ESLINT_PLUGIN='true' VITE_REACT_APP_VERSION=$(cat VERSION) bun run build

FROM oven/bun:1@sha256:0733e50325078969732ebe3b15ce4c4be5082f18c4ac1a0f0ca4839c2e4e42a7 AS builder-classic

WORKDIR /build
COPY web/classic/package.json .
COPY web/classic/bun.lock .
RUN bun install
COPY ./web/classic .
COPY ./VERSION .
RUN VITE_REACT_APP_VERSION=$(cat VERSION) bun run build

FROM golang:1.26.1-alpine@sha256:2389ebfa5b7f43eeafbd6be0c3700cc46690ef842ad962f6c5bd6be49ed82039 AS builder2
ENV GO111MODULE=on CGO_ENABLED=0

ARG TARGETOS
ARG TARGETARCH
ENV GOOS=${TARGETOS:-linux} GOARCH=${TARGETARCH:-amd64}
ENV GOEXPERIMENT=greenteagc

# 新增开始 Default tries CN-friendly proxy first, then proxy.golang.org (override: docker build --build-arg GOPROXY=...)
ARG GOPROXY=https://goproxy.cn,https://proxy.golang.org,direct
ENV GOPROXY=${GOPROXY}
ARG GOSUMDB=sum.golang.google.cn
ENV GOSUMDB=${GOSUMDB}

# 新增结束

WORKDIR /build

ADD go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=builder /build/dist ./web/default/dist
COPY --from=builder-classic /build/dist ./web/classic/dist
RUN go build -ldflags "-s -w -X 'github.com/QuantumNous/new-api/common.Version=$(cat VERSION)'" -o new-api

FROM debian:bookworm-slim@sha256:f06537653ac770703bc45b4b113475bd402f451e85223f0f2837acbf89ab020a

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates tzdata libasan8 wget \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates

# 复制 Go 二进制
COPY --from=builder2 /build/new-api /

# 【新增】复制前端构建产物（如果 new-api 需要读取它们）
COPY --from=builder2 /build/web /web

# 【新增】如果项目根目录还有其他运行时需要的文件（比如 config.yaml），一并复制
# 假设你的程序可能读取根目录下的 config.yaml，可以取消下面这行的注释
# COPY --from=builder2 /build/config.yaml /

# 许可证文件
COPY LICENSE NOTICE THIRD-PARTY-LICENSES.md /licenses/

EXPOSE 3000
WORKDIR /data
ENTRYPOINT ["/new-api"]
