import React, { useState, useCallback } from 'react'
import { apiClient, endpoints } from '../utils/api'
import DataMappingModal from './DataMappingModal'
import { 
  CloudArrowUpIcon, 
  DocumentChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CogIcon
} from '@heroicons/react/24/outline'

interface UploadedFile {
  file: File
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error' | 'mapping'
  result?: any
  error?: string
  csvData?: any[]
  mapping?: any
}

const UploadManager: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [mappingModalOpen, setMappingModalOpen] = useState(false)
  const [currentMappingFile, setCurrentMappingFile] = useState<UploadedFile | null>(null)

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
      readCsvForMapping(file, uploadFile)
    })
  }

  const processFile = async (file: File, uploadFile: UploadedFile) => {
    try {
      // Update progress to show uploading
      setUploadedFiles(prev => prev.map(uf => 
        uf.file === file ? { ...uf, progress: 10 } : uf
      ))

      const formData = new FormData()
      formData.append('file', file)
      formData.append('company_name', 'VeroctaAI Demo Company')

      // Real API call to backend
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      // Update progress
      setUploadedFiles(prev => prev.map(uf => 
        uf.file === file ? { ...uf, progress: 50, status: 'processing' } : uf
      ))

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      // Process the real API response
      const processedResult = {
        transactions_processed: result.transaction_summary?.total_transactions || 0,
        spend_score: result.spend_score || 0,
        insights: {
          waste_detected: Math.round(((result.score_breakdown?.waste_ratio || 0) * 100)),
          duplicates_found: result.score_breakdown?.redundancy_count || 0,
          top_categories: result.transaction_summary?.category_breakdown ? 
            Object.keys(result.transaction_summary.category_breakdown).slice(0, 3) : [],
          recommendations: result.ai_insights?.recommendations || [
            'Upload processed successfully',
            'View detailed insights in the Insights section'
          ]
        },
        raw_result: result
      }

      setUploadedFiles(prev => prev.map(uf => 
        uf.file === file ? { 
          ...uf, 
          progress: 100,
          status: 'completed',
          result: processedResult
        } : uf
      ))

    } catch (error) {
      console.error('Upload error:', error)
      setUploadedFiles(prev => prev.map(uf => 
        uf.file === file ? { 
          ...uf, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed. Please try again.'
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
        title: `Financial Analysis: ${uploadFile.file.name}`,
        data: {
          filename: uploadFile.file.name,
          transactions: uploadFile.result.transactions_processed,
          spend_score: uploadFile.result.spend_score,
          waste_percentage: uploadFile.result.insights.waste_detected,
          duplicates_found: uploadFile.result.insights.duplicates_found,
          top_categories: uploadFile.result.insights.top_categories,
          recommendations: uploadFile.result.insights.recommendations,
          upload_timestamp: new Date().toISOString(),
          raw_analysis: uploadFile.result.raw_result
        }
      })
      alert('Report created successfully! View it in the Reports tab.')
    } catch (error) {
      console.error('Report creation error:', error)
      alert('Failed to create report. Please try again.')
    }
  }

  const readCsvForMapping = async (file: File, uploadFile: UploadedFile) => {
    try {
      const text = await file.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',')
      
      // Parse a few rows for preview
      const csvData = []
      for (let i = 0; i < Math.min(6, lines.length); i++) {
        const row: any = {}
        const values = lines[i].split(',')
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || ''
        })
        csvData.push(row)
      }
      
      setUploadedFiles(prev => prev.map(uf => 
        uf.file === file ? { 
          ...uf, 
          status: 'mapping',
          csvData: csvData,
          progress: 30
        } : uf
      ))
      
    } catch (error) {
      console.error('CSV parsing error:', error)
      setUploadedFiles(prev => prev.map(uf => 
        uf.file === file ? { 
          ...uf, 
          status: 'error',
          error: 'Failed to read CSV file'
        } : uf
      ))
    }
  }

  const openMappingModal = (uploadFile: UploadedFile) => {
    setCurrentMappingFile(uploadFile)
    setMappingModalOpen(true)
  }

  const handleMappingConfirm = (mapping: any) => {
    if (currentMappingFile) {
      // Store mapping and proceed with actual processing
      setUploadedFiles(prev => prev.map(uf => 
        uf.file === currentMappingFile.file ? { 
          ...uf, 
          mapping: mapping,
          status: 'uploading'
        } : uf
      ))
      
      // Now process the file with the mapping
      processFile(currentMappingFile.file, {
        ...currentMappingFile,
        mapping: mapping
      })
    }
    setCurrentMappingFile(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />
      case 'mapping':
        return <CogIcon className="h-5 w-5 text-blue-500" />
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
                      {uploadFile.status === 'mapping' && 'Ready for column mapping'}
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
              {(uploadFile.status === 'uploading' || uploadFile.status === 'processing' || uploadFile.status === 'mapping') && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        uploadFile.status === 'mapping' ? 'bg-blue-600' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${uploadFile.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Mapping Button */}
              {uploadFile.status === 'mapping' && (
                <div className="mt-4 p-4 bg-blue-50 rounded">
                  <h4 className="font-medium text-gray-900 mb-2">Ready for Column Mapping</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Configure how your CSV columns map to our analysis fields.
                  </p>
                  <button
                    onClick={() => openMappingModal(uploadFile)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm inline-flex items-center"
                  >
                    <CogIcon className="h-4 w-4 mr-2" />
                    Configure Mapping
                  </button>
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
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => createReportFromFile(uploadFile)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                    >
                      Create Full Report
                    </button>
                    <button
                      onClick={() => openMappingModal(uploadFile)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm inline-flex items-center"
                    >
                      <CogIcon className="h-4 w-4 mr-2" />
                      Reconfigure Mapping
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Data Mapping Modal */}
      <DataMappingModal
        isOpen={mappingModalOpen}
        onClose={() => {
          setMappingModalOpen(false)
          setCurrentMappingFile(null)
        }}
        csvData={currentMappingFile?.csvData || []}
        onConfirm={handleMappingConfirm}
      />
    </div>
  )
}

export default UploadManager