"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, FileCheck, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CertificateInfo {
  subject: string
  issuer: string
  serialNumber: string
  validFrom: string
  validTo: string
  isValid: boolean
}

interface DigitalSignatureProps {
  documentId: number
  onSignComplete?: (signature: string) => void
  className?: string
}

export function DigitalSignature({
  documentId,
  onSignComplete,
  className,
}: DigitalSignatureProps) {
  const [certificate, setCertificate] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [certInfo, setCertInfo] = useState<CertificateInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSigning, setIsSigning] = useState(false)

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверка типа файла
    if (!file.name.endsWith(".p12") && !file.name.endsWith(".pfx")) {
      setError("Поддерживаются только файлы PKCS#12 (.p12, .pfx)")
      return
    }

    setCertificate(file)
    setError(null)

    // TODO: Парсинг сертификата для отображения информации
    // Здесь должна быть логика чтения PKCS#12 файла
    // Для демонстрации используем мок данные
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setCertInfo({
      subject: "CN=Иванов Иван Иванович, O=ООО Пример",
      issuer: "CN=Удостоверяющий центр Инфоком",
      serialNumber: "12345678901234567890",
      validFrom: "2024-01-01",
      validTo: "2025-12-31",
      isValid: true,
    })
    setIsLoading(false)
  }

  const handleSign = async () => {
    if (!certificate || !password) {
      setError("Загрузите сертификат и введите пароль")
      return
    }

    if (!certInfo?.isValid) {
      setError("Сертификат невалиден или истёк срок действия")
      return
    }

    setIsSigning(true)
    setError(null)

    try {
      // TODO: Реальная подпись документа
      // 1. Загрузить сертификат на сервер
      // 2. Подписать документ (на клиенте через WebCrypto или на сервере)
      // 3. Сохранить подпись в БД
      
      const formData = new FormData()
      formData.append("certificate", certificate)
      formData.append("password", password)
      formData.append("document_id", documentId.toString())

      // Мок для демонстрации
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // const response = await fetch("/api/documents/sign", {
      //   method: "POST",
      //   body: formData,
      // })
      // const data = await response.json()

      onSignComplete?.("signature_data_here")
      
      // Очистка формы
      setCertificate(null)
      setPassword("")
      setCertInfo(null)
      if (document.querySelector('input[type="file"]') as HTMLInputElement) {
        (document.querySelector('input[type="file"]') as HTMLInputElement).value = ""
      }
    } catch (err) {
      setError("Ошибка при подписании документа")
      console.error(err)
    } finally {
      setIsSigning(false)
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Электронная подпись
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {!certInfo ? (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Загрузите сертификат (PKCS#12)
              </label>
              <div className="relative">
                <Input
                  type="file"
                  accept=".p12,.pfx"
                  onChange={handleCertificateUpload}
                  className="cursor-pointer"
                  disabled={isLoading}
                />
                <Upload className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Поддерживаются файлы .p12 и .pfx
              </p>
            </div>

            {isLoading && (
              <div className="text-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Загрузка сертификата...</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Статус сертификата</span>
                <Badge variant={certInfo.isValid ? "success" : "destructive"}>
                  {certInfo.isValid ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Валиден
                    </>
                  ) : (
                    "Невалиден"
                  )}
                </Badge>
              </div>

              <div className="space-y-2 rounded-md bg-muted p-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Владелец:</span>
                  <p className="font-medium">{certInfo.subject}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Издатель:</span>
                  <p className="font-medium">{certInfo.issuer}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Серийный номер:</span>
                  <p className="font-mono text-xs">{certInfo.serialNumber}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Действует с:</span>
                    <p className="font-medium">{certInfo.validFrom}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Действует до:</span>
                    <p className="font-medium">{certInfo.validTo}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Пароль от контейнера
                </label>
                <Input
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSigning}
                />
              </div>

              <Button
                onClick={handleSign}
                disabled={!password || isSigning || !certInfo.isValid}
                className="w-full gap-2"
              >
                <FileCheck className="h-4 w-4" />
                {isSigning ? "Подписание..." : "Подписать документ"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setCertificate(null)
                  setCertInfo(null)
                  setPassword("")
                  setError(null)
                }}
                className="w-full"
              >
                Отменить
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}



