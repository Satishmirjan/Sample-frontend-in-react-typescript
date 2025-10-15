import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, FileText, FolderOpen, Loader2 } from 'lucide-react'
import { Button } from '../src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card'
import { Input } from '../src/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../src/components/ui/select'
import { Loading } from '../src/components/ui/loading'

interface ConversionResult {
  filename: string
  filepath: string
  downloadUrl: string
}

export function ConvertPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [conversionApproach, setConversionApproach] = useState<string>('')
  const [isConverting, setIsConverting] = useState(false)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState<string>('')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError('')
      setResult(null)
    }
  }

  const handleConvert = async () => {
    if (!selectedFile || !conversionApproach) {
      setError('Please select a file and conversion approach')
      return
    }

    setIsConverting(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('approach', conversionApproach)

      // Simulate API call - replace with actual backend endpoint
      const response = await fetch('http://localhost:5000/api/convert', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Conversion failed')
      }

      const data = await response.json()
      setResult({
        filename: data.filename || 'converted_file.xlsx',
        filepath: data.filepath || '/output/converted_file.xlsx',
        downloadUrl: data.download_url || '#'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed')
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (result?.downloadUrl) {
      const link = document.createElement('a')
      link.href = result.downloadUrl
      link.download = result.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Convert PDF to Excel
          </h1>
          <p className="text-lg text-gray-600">
            Upload your tyre experiment reports and convert them to Excel format
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Input
                    type="file"
                    accept=".pdf,.docx,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FileText className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, DOCX, CSV files accepted
                    </span>
                  </label>
                </div>
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              {/* Folder Selector (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Folder (Optional)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Select output folder"
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Conversion Approach */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Conversion Approach
                </label>
                <Select value={conversionApproach} onValueChange={setConversionApproach}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose conversion method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-extraction">Text Extraction</SelectItem>
                    <SelectItem value="table-parsing">Table Parsing</SelectItem>
                    <SelectItem value="ocr">OCR Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleConvert}
                disabled={!selectedFile || !conversionApproach || isConverting}
                className="w-full"
                size="lg"
              >
                {isConverting ? (
                  <>
                    <Loading className="mr-2" />
                    Converting...
                  </>
                ) : (
                  'Convert to Excel'
                )}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Conversion Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isConverting ? (
                <div className="text-center py-8">
                  <Loading size="lg" className="mx-auto mb-4" />
                  <p className="text-gray-600">Processing your file...</p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="font-semibold text-green-800 mb-2">
                      Conversion Successful!
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">File:</span> {result.filename}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span> {result.filepath}
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleDownload} className="w-full" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel File
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Conversion results will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

