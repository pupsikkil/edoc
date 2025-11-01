"use client"

import { useState, useRef, DragEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  accept?: string
  maxSize?: number // в байтах
  multiple?: boolean
  className?: string
}

export function FileUpload({
  onFileSelect,
  accept = ".pdf,.docx,.xlsx,.png,.jpg,.jpeg",
  maxSize = 50 * 1024 * 1024, // 50MB по умолчанию
  multiple = false,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Проверка размера
    if (file.size > maxSize) {
      return `Файл "${file.name}" слишком большой (максимум ${Math.round(maxSize / 1024 / 1024)}MB)`
    }

    // Проверка типа файла
    const acceptedTypes = accept.split(",").map((ext) => ext.trim().replace(".", ""))
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    if (fileExtension && !acceptedTypes.includes(fileExtension)) {
      return `Файл "${file.name}" имеет недопустимый тип`
    }

    return null
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return

    const newFiles: File[] = []
    const newErrors: string[] = []

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file)
      if (error) {
        newErrors.push(error)
      } else {
        newFiles.push(file)
      }
    })

    if (newFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles
      setFiles(updatedFiles)
      onFileSelect(updatedFiles)
      setUploadProgress({})
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      setTimeout(() => setErrors([]), 5000)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFileSelect(updatedFiles)
    
    // Удалить прогресс для этого файла
    const updatedProgress = { ...uploadProgress }
    delete updatedProgress[files[index].name]
    setUploadProgress(updatedProgress)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted hover:border-primary/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm font-medium mb-2">
            Перетащите файлы сюда или
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Выбрать файлы
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Максимальный размер: {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Выбранные файлы:</p>
          {files.map((file, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                      {uploadProgress[file.name] !== undefined && (
                        <div className="mt-2 w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress[file.name]}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}



