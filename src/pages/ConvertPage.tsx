import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, FileText, FolderOpen, X } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Loading } from '../components/ui/loading'

interface ConversionResult {
  filename: string
  filepath: string
  downloadUrl: string
}

export function ConvertPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showFileList, setShowFileList] = useState(false)
  const [conversionApproach, setConversionApproach] = useState<string>('')
  const [destinationPath, setDestinationPath] = useState<string>('downloads/')
  const [isConverting, setIsConverting] = useState(false)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState<string>('')

  const [fileContents, setFileContents] = useState<{ name: string; content: string }[]>([])

  // MOCK EXCEL PREVIEW
  const mockExcelPreview = [
    { name: 'Rahul', email: 'rahul@gmail.com', marks: 87 },
    { name: 'Priya', email: 'priya@gmail.com', marks: 92 }
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    if (files.length > 0) {
      setSelectedFiles(files)
      setShowFileList(false)
      setError('')
      setResult(null)

      const mockContents = files.map((file) => ({
        name: file.name,
        content: `Preview of ${file.name}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. This simulates file content.`
      }))
      setFileContents(mockContents)
    }
  }

  const handleConvert = async () => {
    if (selectedFiles.length === 0 || !conversionApproach) {
      setError('Please select at least one file and conversion approach')
      return
    }
    setIsConverting(true)
    setTimeout(() => {
      setResult({
        filename: 'merged_result.xlsx',
        filepath: destinationPath + 'merged_result.xlsx',
        downloadUrl: '#'
      })
      setIsConverting(false)
    }, 1500)
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="px-6 pt-4 pb-2">
        <h1 className="text-sm md:text-base font-semibold text-gray-700 tracking-wide uppercase">
          File Conversion Tool
        </h1>
      </div>

      <div className="relative flex flex-wrap items-center gap-4 px-6 pb-4">
        <div className="flex items-center gap-2 relative">
          <Input type="file" accept=".pdf,.docx,.csv" multiple onChange={handleFileSelect} id="file-upload" className="hidden" />
          <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-400 transition">
            <Upload className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">Select Files</span>
          </label>

          {selectedFiles.length > 0 && (
            <button onClick={() => setShowFileList((prev) => !prev)} className="text-sm text-green-600 underline cursor-pointer">
              {selectedFiles.length} files selected
            </button>
          )}

          {showFileList && (
            <motion.div className="absolute top-12 left-0 bg-white border shadow rounded-md w-64 max-h-48 overflow-y-auto z-10">
              <div className="flex justify-between items-center p-2 border-b">
                <span className="text-sm font-medium text-gray-700">Selected Files</span>
                <button onClick={() => setShowFileList(false)}><X className="h-4 w-4" /></button>
              </div>
              <ul className="p-2 text-sm text-gray-700 space-y-1">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="truncate hover:bg-gray-50 rounded px-1">
                    {index + 1}. {file.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Method:</span>
          <Select value={conversionApproach} onValueChange={setConversionApproach}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Choose method" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="text-extraction">Text Extraction</SelectItem>
              <SelectItem value="table-parsing">Table Parsing</SelectItem>
              <SelectItem value="ocr">OCR Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleConvert} disabled={!conversionApproach || isConverting} className="ml-auto">
          {isConverting ? <Loading className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isConverting ? 'Converting...' : 'Convert to Excel'}
        </Button>
      </div>

      <div className="flex-1 px-6 pb-8">
        <motion.div className="grid md:grid-cols-2 gap-6 h-full">

          {/* LEFT SIDE PREVIEW — SAME */}
          <Card className="shadow-md h-[70vh] overflow-y-auto">
            <CardHeader><CardTitle><FileText /> File Contents</CardTitle></CardHeader>
            <CardContent className="p-4">
              {fileContents.length === 0 ? (
                <p className="text-gray-400 text-sm italic text-center mt-20">File content will appear here after selection.</p>
              ) : fileContents.map((file) => (
                <div key={file.name} className="mb-4">
                  <h3 className="font-semibold">{file.name}</h3>
                  <pre className="bg-gray-50 p-2 rounded-md text-xs">{file.content}</pre>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ✅ RIGHT SIDE WITH TABLE + DOWNLOAD BELOW */}
          <Card className="shadow-md h-[70vh] flex flex-col">
            <CardHeader><CardTitle><Download /> Conversion Result</CardTitle></CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto">

              {isConverting ? (
                <div className="text-center">
                  <Loading size="lg" className="mx-auto mb-4 animate-spin" />
                  <p>Processing your files...</p>
                </div>
              ) : result ? (
                <>
                  <p className="text-sm font-medium mb-2">Preview of Generated Excel:</p>
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="border">
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockExcelPreview.map((row, idx) => (
                        <tr key={idx} className="border">
                          <td className="p-2">{row.name}</td>
                          <td className="p-2">{row.email}</td>
                          <td className="p-2">{row.marks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <p className="text-gray-400 text-sm italic text-center mt-20">Converted result will appear here.</p>
              )}

            </CardContent>

            {/* ✅ DOWNLOAD BUTTON FIXED BOTTOM */}
            {result && (
              <div className="p-4 border-t text-center">
                <Button size="lg">
                  <Download className="h-4 w-4 mr-2" /> Download Excel
                </Button>
              </div>
            )}
          </Card>

        </motion.div>
      </div>
    </section>
  )
}
