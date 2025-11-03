import React from 'react'
import { useId } from 'react'
function Select({
    options,
    className="",
    ref,
    label,
    ...props
}) {
    const id=useId()
  return (
<div>
{label && <label htmlFor={id} className={`${className}`}>
    {label}
    </label>}
    <select  id={id} ref={ref} {...props} className={`${className} px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full`}>
     {options?.map((option)=>(
  <option key={option} value={option}>
  {option}
  </option>

     ))}

    </select>

</div>
  )
}

export default Select
