export interface CsvRow {
  [key: string]: string | number | null | undefined
}

export const exportToCsv = (
  filename: string,
  rows: CsvRow[]
) => {
  if (!rows.length) return

  const headers = Object.keys(rows[0])

  const csvRows = rows.map((row) =>
    headers.map((header) => {
      const value = row[header]

      if (value === null || value === undefined) {
        return ""
      }

      const escaped = String(value).replace(/"/g, '""')

      return `"${escaped}"`
    })
  )

  const csvContent = [
    headers,
    ...csvRows,
  ]
    .map((row) => row.join(","))
    .join("\n")

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")

  link.href = url

  link.setAttribute("download", filename)

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}