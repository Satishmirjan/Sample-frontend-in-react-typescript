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
  const [results, setResults] = useState<ConversionResult[]>([])
  const [error, setError] = useState<string>('')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    if (files.length > 0) {
      setSelectedFiles(files)
      setError('')
      setResults([])
    }
  }

  const handleConvert = async () => {
    if (selectedFiles.length === 0 || !conversionApproach) {
      setError('Please select at least one file and conversion approach')
      return
    }

    setIsConverting(true)
    setError('')

    try {
      const formData = new FormData()
      selectedFiles.forEach((file) => formData.append('files', file))
      formData.append('approach', conversionApproach)
      formData.append('destination', destinationPath)

      const response = await fetch('http://localhost:5000/api/convert', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Conversion failed')

      const data = await response.json()

      setResults(
        Array.isArray(data)
          ? data.map((d) => ({
              filename: d.filename || 'converted_file.xlsx',
              filepath: d.filepath || '/output/converted_file.xlsx',
              downloadUrl: d.download_url || '#',
            }))
          : [
              {
                filename: data.filename || 'converted_file.xlsx',
                filepath: data.filepath || '/output/converted_file.xlsx',
                downloadUrl: data.download_url || '#',
              },
            ]
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed')
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownloadAll = () => {
    results.forEach((res) => {
      if (res.downloadUrl) {
        const link = document.createElement('a')
        link.href = res.downloadUrl
        link.download = res.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header Section */}
      <div className="px-6 pt-4 pb-2">
        <h1 className="text-sm md:text-base font-semibold text-gray-700 tracking-wide uppercase">
          File Conversion Tool
        </h1>
      </div>

      {/* Horizontal Controls */}
      <div className="relative flex flex-wrap items-center gap-4 px-6 pb-4">
        {/* File Upload */}
        <div className="flex items-center gap-2 relative">
          <Input
            type="file"
            accept=".pdf,.docx,.csv"
            multiple
            onChange={handleFileSelect}
            id="file-upload"
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-400 transition"
          >
            <Upload className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">Select Files</span>
          </label>

          {selectedFiles.length > 0 && (
            <button
              onClick={() => setShowFileList((prev) => !prev)}
              className="text-sm text-green-600 underline cursor-pointer"
            >
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
            </button>
          )}

          {/* Dropdown showing file names */}
          {showFileList && selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-12 left-0 bg-white border border-gray-200 shadow-lg rounded-md w-64 max-h-48 overflow-y-auto z-10"
            >
              <div className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Selected Files</span>
                <button
                  onClick={() => setShowFileList(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
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

        {/* Conversion Approach */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Method:</span>
          <Select value={conversionApproach} onValueChange={setConversionApproach}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Choose method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-extraction">Text Extraction</SelectItem>
              <SelectItem value="table-parsing">Table Parsing</SelectItem>
              <SelectItem value="ocr">OCR Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Destination Path */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Destination:</span>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm px-2">
            <FolderOpen className="h-4 w-4 text-gray-500 mr-1" />
            <Input
              type="text"
              value={destinationPath}
              onChange={(e) => setDestinationPath(e.target.value)}
              placeholder="downloads/"
              className="border-none focus:ring-0 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Convert Button */}
        <Button
          onClick={handleConvert}
          disabled={selectedFiles.length === 0 || !conversionApproach || isConverting}
          className="ml-auto"
        >
          {isConverting ? (
            <>
              <Loading className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            'Convert to Excel'
          )}
        </Button>
      </div>

      {/* Result Section */}
      <div className="flex-1 px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="h-full"
        >
          <Card className="flex-1 flex flex-col justify-center shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Download className="h-5 w-5" />
                Conversion Result
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex items-center justify-center">
              {isConverting ? (
                <div className="text-center py-10">
                  <Loading size="lg" className="mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Processing your files...</p>
                </div>
              ) : results.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-xl mx-auto space-y-5"
                >
                  <div className="p-5 bg-green-50 border border-green-200 rounded-md shadow-sm">
                    <h3 className="font-semibold text-green-800 mb-3">
                      Conversion Successful!
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {results.map((res, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{res.filename}</span>
                          <a
                            href={res.downloadUrl}
                            download={res.filename}
                            className="text-blue-600 hover:underline"
                          >
                            Download
                          </a>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-gray-600">
                      Saved to: <strong>{destinationPath}</strong>
                    </p>
                  </div>
                  <Button onClick={handleDownloadAll} className="w-full" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download All Files
                  </Button>
                </motion.div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Conversion results will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
