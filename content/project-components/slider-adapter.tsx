export function Slider({value,onValueChange,...props}:any){return <input type="range" {...props} value={value[0]} onChange={e=>onValueChange([Number(e.target.value)])}/>}
