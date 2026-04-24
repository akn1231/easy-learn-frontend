/**
 * Creates a debounced version of a function that delays execution
 * until after `delay` ms have elapsed since the last invocation.
 */
export const debounce = (fn, delay = 300) => {
  let timerId
  const debounced = (...args) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => fn(...args), delay)
  }
  debounced.cancel = () => clearTimeout(timerId)
  return debounced
}
