'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
   * 返回f的包装函数，延时delay毫秒调用f
   * 若两次f之间的调用间隔小于delay，那么取消前一次调用
   * @param f 
   */
function deBouncing(f: (...args: any[]) => any, delay: number) {
  let lastCallTime: number | null = null
  let lastTimeout: any = null
  return (...args: Parameters<typeof f>) => {
    const currentTime = Date.now()
    if (lastCallTime) {
      if (currentTime - lastCallTime < delay) {
        clearTimeout(lastTimeout) // 取消上一次执行
      }
    }
    lastCallTime = currentTime
    lastTimeout = setTimeout(() => f(...args), delay)
  }
}
export default function Search({ placeholder }: { placeholder: string }) {

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const handleSearch = deBouncing(function(term: string) {
    console.log(term)
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("page", "1")
    if (term) {
      newSearchParams.set("query", term)
    } else {
      newSearchParams.delete("query")
    }
    replace(`${pathname}?${newSearchParams.toString()}`)
  }, 800)

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => {
          // debouncing,消除抖动
          // 1. 事件发生时，启动一个计时器
          // 2. 在计时器到期前，新的事件出现，重置计时器
          // 3. 当计时器到期，执行事件处理函数
          const term = e.target.value
          handleSearch(term)
        }}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
