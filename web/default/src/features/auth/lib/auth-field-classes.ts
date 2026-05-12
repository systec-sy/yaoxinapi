import { cn } from '@/lib/utils'

/** Label style shared across auth forms (sign-in, sign-up, forgot password). */
export const authFieldLabelClassName =
  'text-[0.9375rem] font-normal text-gray-600 dark:text-muted-foreground'

const authTextBase =
  'h-11 rounded-lg border border-gray-200 bg-white text-base transition-[color,box-shadow] md:text-sm outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#ffffff] [&:-webkit-autofill]:transition-[background-color,color]_9999s_linear dark:border-border dark:bg-transparent dark:text-foreground dark:[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#18181b]'

/** Text / email `<Input>` fields (without left icon padding). */
export const authBareTextInputClassName = cn(authTextBase, 'px-3')

/** Text `<Input>` with left icon alignment. */
export const authLeadingIconInputClassName = cn(authTextBase, 'pl-10')

const authPasswordInnerBase =
  '[&_input]:h-11 [&_input]:rounded-lg [&_input]:border [&_input]:border-gray-200 [&_input]:bg-white [&_input]:text-base md:[&_input]:text-sm [&_input]:pl-10 [&_input]:pr-10 [&_input]:outline-none [&_input]:transition-[color,box-shadow] [&_input]:focus-visible:border-indigo-500 [&_input]:focus-visible:ring-1 [&_input]:focus-visible:ring-indigo-500 [&_input]:focus-visible:ring-offset-0 [&_input:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#ffffff] [&_input:-webkit-autofill]:transition-[background-color,color]_9999s_linear dark:[&_input]:border-border dark:[&_input]:bg-transparent dark:[&_input]:text-foreground dark:[&_input:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#18181b]'

/** Passed to `<PasswordInput className>` (lock left, visibility toggle right). */
export const authPasswordInputWrapperClassName = cn(authPasswordInnerBase)

export const authGradientSubmitButtonClassName =
  'h-12 w-full justify-center gap-2 rounded-lg border-0 bg-gradient-to-r from-[#6366F1] to-[#3B82F6] text-base font-semibold text-white shadow-md shadow-indigo-500/30 hover:brightness-105 focus-visible:ring-indigo-400/40 dark:focus-visible:ring-indigo-400/30'
