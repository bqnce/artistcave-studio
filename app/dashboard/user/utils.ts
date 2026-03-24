const monthNamesHuLong = [
    "Január", "Február", "Március", "Április", "Május", "Június",
    "Július", "Augusztus", "Szeptember", "Október", "November", "December"
  ];
  
  const dayNamesHuShort = ["vas.", "hétf.", "kedd", "szerd.", "csüt.", "pént.", "szomb."];
  const dayNamesHuLong = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
  
  export function formatBookingDate(dateString: string) {
    const date = new Date(dateString)
    const dayNum = date.getDate()
    const dayNameShort = dayNamesHuShort[date.getDay()]
    const dayNameLong = dayNamesHuLong[date.getDay()];
    const monthLong = monthNamesHuLong[date.getMonth()];
    
    const hours = date.getHours().toString().padStart(2, '0')
    const mins = date.getMinutes().toString().padStart(2, '0')
  
    return {
      monthLong,
      dayNumStr: dayNum.toString(),
      subtitle: `${dayNameLong} • ${hours}:${mins}`,
      timeStr: `${hours}:${mins}`,
      dayNameShort
    }
  }
  
  export function getGreetingName(name: string) {
    if (!name) return 'Vendég'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 2) return parts[1]
    return name
  }