import React, { useState, useEffect } from 'react'
import { XMarkIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface DataMappingModalProps {
  isOpen: boolean
  onClose: () => void
  csvData: any[]
  onConfirm: (mapping: ColumnMapping) => void
}

interface ColumnMapping {
  date: string
  description: string
  amount: string
  category?: string
  vendor?: string
  [key: string]: string | undefined
}

const DataMappingModal: React.FC<DataMappingModalProps> = ({
  isOpen,
  onClose,
  csvData,
  onConfirm
}) => {
  const [mapping, setMapping] = useState<ColumnMapping>({
    date: '',
    description: '',
    amount: '',
    category: '',
    vendor: ''
  })
  const [availableColumns, setAvailableColumns] = useState<string[]>([])
  const [previewData, setPreviewData] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (csvData && csvData.length > 0) {
      const columns = Object.keys(csvData[0])
      setAvailableColumns(columns)
      setPreviewData(csvData.slice(0, 5))
      
      // Auto-detect columns
      const autoMapping = autoDetectColumns(columns)
      setMapping(autoMapping)
    }
  }, [csvData])

  const autoDetectColumns = (columns: string[]): ColumnMapping => {
    const mapping: ColumnMapping = {
      date: '',
      description: '',
      amount: '',
      category: '',
      vendor: ''
    }

    columns.forEach(col => {
      const lowerCol = col.toLowerCase()
      
      // Date detection
      if (!mapping.date && (
        lowerCol.includes('date') || 
        lowerCol.includes('time') ||
        lowerCol === 'transaction date'
      )) {
        mapping.date = col
      }
      
      // Amount detection
      if (!mapping.amount && (
        lowerCol.includes('amount') || 
        lowerCol.includes('total') ||
        lowerCol.includes('price') ||
        lowerCol.includes('cost')
      )) {
        mapping.amount = col
      }
      
      // Description detection
      if (!mapping.description && (
        lowerCol.includes('description') || 
        lowerCol.includes('memo') ||
        lowerCol.includes('details') ||
        lowerCol.includes('reference')
      )) {
        mapping.description = col
      }
      
      // Category detection
      if (!mapping.category && (
        lowerCol.includes('category') || 
        lowerCol.includes('class') ||
        lowerCol.includes('type')
      )) {
        mapping.category = col
      }
      
      // Vendor detection
      if (!mapping.vendor && (
        lowerCol.includes('vendor') || 
        lowerCol.includes('payee') ||
        lowerCol.includes('merchant') ||
        lowerCol.includes('name')
      )) {
        mapping.vendor = col
      }
    })

    return mapping
  }

  const validateMapping = (): string[] => {
    const errors: string[] = []
    
    if (!mapping.date) errors.push('Date column is required')
    if (!mapping.description) errors.push('Description column is required')
    if (!mapping.amount) errors.push('Amount column is required')
    
    // Check for duplicate mappings
    const usedColumns = Object.values(mapping).filter(Boolean)
    const duplicates = usedColumns.filter((col, index) => usedColumns.indexOf(col) !== index)
    if (duplicates.length > 0) {
      errors.push(`Duplicate column mappings: ${duplicates.join(', ')}`)
    }
    
    return errors
  }

  const handleMappingChange = (field: string, column: string) => {
    setMapping(prev => ({ ...prev, [field]: column }))
    
    // Clear errors when user makes changes
    setErrors([])
  }

  const handleConfirm = () => {
    const validationErrors = validateMapping()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    
    onConfirm(mapping)
    onClose()
  }

  const getPreviewValue = (row: any, column: string) => {
    if (!column) return '-'
    const value = row[column]
    if (value === null || value === undefined) return '-'
    return String(value).length > 30 ? String(value).substring(0, 30) + '...' : String(value)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Map CSV Columns</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Mapping Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Column Mapping</h4>
              
              {/* Required Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Column <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={mapping.date}
                    onChange={(e) => handleMappingChange('date', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select column...</option>
                    {availableColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description Column <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={mapping.description}
                    onChange={(e) => handleMappingChange('description', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select column...</option>
                    {availableColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Column <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={mapping.amount}
                    onChange={(e) => handleMappingChange('amount', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select column...</option>
                    {availableColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* Optional Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Column (Optional)
                  </label>
                  <select
                    value={mapping.category || ''}
                    onChange={(e) => handleMappingChange('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select column...</option>
                    {availableColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor/Payee Column (Optional)
                  </label>
                  <select
                    value={mapping.vendor || ''}
                    onChange={(e) => handleMappingChange('vendor', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select column...</option>
                    {availableColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Data Preview</h4>
              <div className="bg-gray-50 rounded-md p-4 max-h-80 overflow-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-1 font-medium text-gray-700">Date</th>
                      <th className="text-left py-2 px-1 font-medium text-gray-700">Description</th>
                      <th className="text-left py-2 px-1 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-2 px-1 font-medium text-gray-700">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-1 px-1 text-gray-600">
                          {getPreviewValue(row, mapping.date)}
                        </td>
                        <td className="py-1 px-1 text-gray-600">
                          {getPreviewValue(row, mapping.description)}
                        </td>
                        <td className="py-1 px-1 text-gray-600">
                          {getPreviewValue(row, mapping.amount)}
                        </td>
                        <td className="py-1 px-1 text-gray-600">
                          {getPreviewValue(row, mapping.category || '')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {errors.length === 0 && mapping.date && mapping.description && mapping.amount && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <CheckIcon className="h-5 w-5 text-green-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Column mapping is valid! Ready to process your data.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={errors.length > 0 || !mapping.date || !mapping.description || !mapping.amount}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Apply Mapping
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataMappingModal