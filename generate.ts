import { parse, stringify } from 'jsr:@std/csv'
import * as path from 'jsr:@std/path'

let OPENSCAD = '/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD'
if (Deno.build.os == 'windows') {
  OPENSCAD = 'C:\\Program Files\\OpenSCAD (Nightly)\\openscad.exe'
} else if (Deno.build.os == 'linux') {
  OPENSCAD = 'openscad'
}

const text = await Deno.readTextFile('samples.csv')
const data = parse(text, {
  skipFirstRow: true,
  strip: true,
})

try {
  await Deno.mkdir('stl')
} catch (_err) {
  // folder already exists
}

function splitstr(input: string, maxlength: number) {
  const words = input.split(' ')
  const result = ['']
  for (const word of words) {
    const r = `${result[result.length - 1]} ${word}`.trim()
    if (r.length <= maxlength) result[result.length - 1] = r
    else result.push(word)
  }
  return result
}

for (const row of data) {
  console.log(row.brand, '-', row.type, '-', row.color)

  // const color = row.color?.split(' ') || []
  const color = splitstr(row.color || '', 11)
  const COLOR_LINES = color?.length
  const filename = path.join('stl', `${Object.values(row).join('_')}.stl`)
  console.log(filename)
  const command = new Deno.Command(OPENSCAD, {
    args: [
      `-o`,
      filename,
      '-D',
      `BRAND="${row.brand}"`,
      '-D',
      `FILAMENT="${row.type?.toUpperCase()}"`,
      '-D',
      `COLOR_LINES=${COLOR_LINES}`,
      ...color.flatMap((c, i) => ['-D', `COLOR${i + 1}="${c}"`]),
      '-D',
      `COLOR="${color}"`,
      'text.scad',
    ],
    stdin: 'piped',
    stdout: 'piped',
  })
  const _process = command.spawn()
  // const result = await process.output();
}
