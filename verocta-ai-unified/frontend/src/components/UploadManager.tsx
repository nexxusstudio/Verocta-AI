import React, { useState, useCallback } from 'react'
import { apiClient } from '@utils/api'
import { 
  CloudArrowUpIcon, 
  DocumentChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface UploadedFile {
  file: File
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  result?: any
  error?: string
}

const UploadManager: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    const csvFiles = files.filter(file => file.name.endsWith('.csv'))
    
    if (csvFiles.length === 0) {
      alert('Please select CSV files only')
      return
    }

    csvFiles.forEach(file => {
      const uploadFile: UploadedFile = {
        file,
        progress: 0,
        status: 'uploading'
      }
      
      setUploadedFiles(prev => [...prev, uploadFile])
      processFile(file, uploadFile)
    })
  }

  const processFile = async (file: File, uploadFile: UploadedFile) => {
    try {
      // Simulate file upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(uf => 
          uf.file === file ? { ...uf, progress: Math.min(uf.progress + 10, 90) } : uf
        ))
      }, 100)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('company_name', 'Demo Company')

      // Simulate processing
      setTimeout(() => {
        clearInterval(interval)
        setUploadedFiles(prev => prev.map(uf => 
          uf.file === file ? { 
            ...uf, 
            progress: 100, 
            status: 'processing'
          } : uf
        ))

        // Simulate completion after processing
        setTimeout(() => {
          const mockResult = {
            transactions_processed: Math.floor(Math.random() * 1000) + 100,
            spend_score: Math.floor(Math.random() * 30) + 70,
            insights: {
              waste_detected: Math.floor(Math.random() * 20) + 5,
              duplicates_found: Math.floor(Math.random() * 10) + 1,
              top_categories: ['Office Supplies', 'Software', 'Marketing'],
              recommendations: [
                'Consider consolidating vendor payments',
                'Review subscription services for duplicates',
                'Implement expense approval workflows'
              ]
            }
          }

          setUploadedFiles(prev => prev.map(uf => 
            uf.file === file ? { 
              ...uf, 
              status: 'completed',
              result: mockResult
            } : uf
          ))
        }, 2000)
      }, 1000)

    } catch (error) {
      setUploadedFiles(prev => prev.map(uf => 
        uf.file === file ? { 
          ...uf, 
          status: 'error',
          error: 'Upload failed. Please try again.'
        } : uf
      ))
    }
  }

  const removeFile = (file: File) => {
    setUploadedFiles(prev => prev.filter(uf => uf.file !== file))
  }

  const createReportFromFile = async (uploadFile: UploadedFile) => {
    try {
      const response = await apiClient.post('/reports', {
        title: `Analysis: ${uploadFile.file.name}`,
        data: {
          transactions: uploadFile.result.transactions_processed,
          total_amount: uploadFile.result.transactions_processed * 150, // Mock calculation
          categories: uploadFile.result.insights.top_categories.length
        }
      })
      alert('Report created successfully! View it in the Reports tab.')
    } catch (error) {
      alert('Failed to create report. Please try again.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">CSV & Data Upload</h2>
        <p className="mt-2 text-gray-600">Upload your financial data for AI-powered analysis</p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">Upload CSV Files</h3>
          <p className="mt-1 text-sm text-gray-600">
            Drag and drop your CSV files here, or click to browse
          </p>
        </div>
        <div className="mt-6">
          <label className="cursor-pointer">
            <span className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
              Choose Files
            </span>
            <input
              type="file"
              multiple
              accept=".csv"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Supports: QuickBooks, Wave, Revolut, Xero, and custom CSV formats
        </p>
      </div>

      {/* Google Sheets Integration */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <DocumentChartBarIcon className="h-8 w-8 text-green-600" />
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-900">Google Sheets Integration</h3>
            <p className="text-sm text-green-700">Connect your Google Sheets for real-time data sync</p>
          </div>
        </div>
        <div className="mt-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Connect Google Sheets (Coming Soon)
          </button>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Processing Files</h3>
          {uploadedFiles.map((uploadFile, index) => (
            <div key={index} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(uploadFile.status)}
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{uploadFile.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {uploadFile.status === 'uploading' && 'Uploading...'}
                      {uploadFile.status === 'processing' && 'Processing data...'}
                      {uploadFile.status === 'completed' && 'Analysis complete'}
                      {uploadFile.status === 'error' && uploadFile.error}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(uploadFile.file)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Progress Bar */}
              {(uploadFile.status === 'uploading' || uploadFile.status === 'processing') && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadFile.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Results */}
              {uploadFile.status === 'completed' && uploadFile.result && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h4 className="font-medium text-gray-900 mb-2">Analysis Results</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Transactions:</span>
                      <span className="ml-2 font-medium">{uploadFile.result.transactions_processed}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">SpendScore:</span>
                      <span className="ml-2 font-medium text-green-600">{uploadFile.result.spend_score}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Waste Detected:</span>
                      <span className="ml-2 font-medium text-red-600">{uploadFile.result.insights.waste_detected}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Duplicates:</span>
                      <span className="ml-2 font-medium">{uploadFile.result.insights.duplicates_found}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => createReportFromFile(uploadFile)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                    >
                      Create Full Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UploadManager