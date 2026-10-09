export default function EnquiryChart({ data = [] }) {
  if (!data.length) return <div className="flex h-[280px] items-center justify-center text-sm text-slate-500">Enquiry statistics are unavailable.</div>;
  const width = 700, height = 280, left = 42, right = 16, top = 18, bottom = 40;
  const maximum = Math.max(4, ...data.map(day => day.enquiries));
  const x = index => left + index * (width - left - right) / Math.max(1, data.length - 1);
  const y = value => height - bottom - value * (height - top - bottom) / maximum;
  const points = data.map((day, index) => `${x(index)},${y(day.enquiries)}`).join(" ");
  const area = `${left},${height-bottom} ${points} ${x(data.length-1)},${height-bottom}`;
  return <div className="w-full">
    <svg viewBox={`0 0 ${width} ${height}`} className="block w-full" role="img" aria-labelledby="enquiry-chart-title enquiry-chart-description">
      <title id="enquiry-chart-title">Enquiries during the last 14 days</title>
      <desc id="enquiry-chart-description">{data.map(day => `${day.date}: ${day.enquiries} enquiries`).join("; ")}</desc>
      <defs><linearGradient id="enquiry-area-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c89a40" stopOpacity=".25" /><stop offset="100%" stopColor="#c89a40" stopOpacity=".02" /></linearGradient></defs>
      {[0,1,2,3,4].map(tick => {
        const count = Math.round(maximum * tick / 4);
        return <g key={tick}><line x1={left} x2={width-right} y1={y(count)} y2={y(count)} stroke="#e9e1d2" strokeDasharray="4 4" /><text x={left-10} y={y(count)+4} textAnchor="end" fill="#77716a" fontSize="11">{count}</text></g>;
      })}
      <polygon points={area} fill="url(#enquiry-area-fill)" />
      <polyline points={points} fill="none" stroke="#8a621b" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((day,index) => <g key={day.date}><circle cx={x(index)} cy={y(day.enquiries)} r="4" fill="#8a621b"><title>{`${day.date}: ${day.enquiries} ${day.enquiries===1?"enquiry":"enquiries"}`}</title></circle>{(index===0 || index===data.length-1 || index%3===0) && <text x={x(index)} y={height-15} textAnchor="middle" fill="#77716a" fontSize="10">{day.date}</text>}</g>)}
    </svg>
    <p className="mt-3 text-xs text-slate-500">Daily enquiries · Hover over a point to see the count</p>
  </div>;
}
