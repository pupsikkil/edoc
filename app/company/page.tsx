"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Upload,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Settings,
  Users,
  FileText,
  Image as ImageIcon,
} from "lucide-react"
import { useState } from "react"

const mockCompanyData = {
  name: "ООО «ТехноСервис»",
  inn: "12345678901234",
  ogrn: "98765432109876",
  kpp: "123456789",
  legalAddress: "г. Бишкек, ул. Чуй, д. 123",
  actualAddress: "г. Бишкек, ул. Чуй, д. 123",
  email: "info@technoservice.kg",
  phone: "+996 312 123456",
  website: "www.technoservice.kg",
  bankAccounts: [
    {
      id: 1,
      bank: "АО «Банк Компаньон»",
      account: "12345678901234567890",
      bik: "123456789",
    },
  ],
}

const mockUsers = [
  {
    id: 1,
    name: "Иванов Иван Иванович",
    email: "ivanov@technoservice.kg",
    role: "Директор",
    status: "Активен",
  },
  {
    id: 2,
    name: "Петров Петр Петрович",
    email: "petrov@technoservice.kg",
    role: "Главный бухгалтер",
    status: "Активен",
  },
  {
    id: 3,
    name: "Сидорова Анна Сергеевна",
    email: "sidorova@technoservice.kg",
    role: "Юрист",
    status: "Активен",
  },
]

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState("details")
  const [companyData, setCompanyData] = useState(mockCompanyData)

  const tabs = [
    { id: "details", label: "Реквизиты", icon: Building2 },
    { id: "bank", label: "Банковские реквизиты", icon: CreditCard },
    { id: "files", label: "Файлы", icon: ImageIcon },
    { id: "users", label: "Пользователи", icon: Users },
    { id: "workflows", label: "Маршруты согласования", icon: FileText },
    { id: "settings", label: "Настройки", icon: Settings },
  ]

  const handleInputChange = (field: string, value: string) => {
    setCompanyData({ ...companyData, [field]: value })
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto bg-muted/40">
          <div className="container mx-auto p-6">
            {/* Заголовок */}
            <div className="mb-6">
              <h1 className="text-h1 mb-2">Профиль компании</h1>
              <p className="text-muted-foreground text-body">
                Управление реквизитами компании, пользователями и настройками
              </p>
            </div>

            {/* Вкладки */}
            <Card className="mb-6">
              <div className="border-b">
                <div className="flex gap-1 p-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <CardContent className="p-6">
                {/* Вкладка: Реквизиты */}
                {activeTab === "details" && (
                  <div>
                    <h2 className="mb-6 text-h2">Реквизиты компании</h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Название компании
                        </label>
                        <Input
                          value={companyData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">ИНН</label>
                        <Input
                          value={companyData.inn}
                          onChange={(e) => handleInputChange("inn", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">ОГРН</label>
                        <Input
                          value={companyData.ogrn}
                          onChange={(e) => handleInputChange("ogrn", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">КПП</label>
                        <Input
                          value={companyData.kpp}
                          onChange={(e) => handleInputChange("kpp", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Юридический адрес
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            value={companyData.legalAddress}
                            onChange={(e) =>
                              handleInputChange("legalAddress", e.target.value)
                            }
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Фактический адрес
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            value={companyData.actualAddress}
                            onChange={(e) =>
                              handleInputChange("actualAddress", e.target.value)
                            }
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="email"
                            value={companyData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">Телефон</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="tel"
                            value={companyData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">Сайт</label>
                        <Input
                          value={companyData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                      <Button variant="outline">Отмена</Button>
                      <Button className="gap-2">
                        <Save className="h-4 w-4" />
                        Сохранить изменения
                      </Button>
                    </div>
                  </div>
                )}

                {/* Вкладка: Банковские реквизиты */}
                {activeTab === "bank" && (
                  <div>
                    <h2 className="mb-6 text-h2">Банковские реквизиты</h2>
                    {companyData.bankAccounts.map((account) => (
                      <Card key={account.id} className="mb-4">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="mb-2 block text-sm font-medium">Банк</label>
                              <Input defaultValue={account.bank} />
                            </div>
                            <div>
                              <label className="mb-2 block text-sm font-medium">БИК</label>
                              <Input defaultValue={account.bik} />
                            </div>
                            <div>
                              <label className="mb-2 block text-sm font-medium">
                                Расчётный счёт
                              </label>
                              <Input defaultValue={account.account} className="font-mono" />
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm">
                              Удалить
                            </Button>
                            <Button size="sm">Сохранить</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button variant="outline" className="mt-4">
                      + Добавить банковский счёт
                    </Button>
                  </div>
                )}

                {/* Вкладка: Файлы */}
                {activeTab === "files" && (
                  <div>
                    <h2 className="mb-6 text-h2">Файлы компании</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                          <p className="mb-2 font-medium">Логотип компании</p>
                          <p className="mb-4 text-small text-muted-foreground">
                            PNG/SVG, до 2MB
                          </p>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Загрузить
                          </Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                          <p className="mb-2 font-medium">Печать компании</p>
                          <p className="mb-4 text-small text-muted-foreground">
                            PNG с прозрачностью
                          </p>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Загрузить
                          </Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                          <p className="mb-2 font-medium">Фирменный бланк</p>
                          <p className="mb-4 text-small text-muted-foreground">
                            DOCX/PDF шаблон
                          </p>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Загрузить
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Вкладка: Пользователи */}
                {activeTab === "users" && (
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-h2">Пользователи и роли</h2>
                      <Button className="gap-2">
                        <User className="h-4 w-4" />
                        Пригласить пользователя
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {mockUsers.map((user) => (
                        <Card key={user.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-small text-muted-foreground">
                                    {user.email}
                                  </p>
                                  <Badge variant="outline" className="mt-1">
                                    {user.role}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="success">{user.status}</Badge>
                                <Button variant="outline" size="sm">
                                  Изменить
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Вкладка: Маршруты согласования */}
                {activeTab === "workflows" && (
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-h2">Маршруты согласования</h2>
                      <Button>Создать маршрут</Button>
                    </div>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-muted-foreground">
                          Здесь будут шаблоны маршрутов согласования документов
                        </p>
                        <p className="mt-2 text-small text-muted-foreground">
                          Пример: Юрист → Бухгалтер → Директор → Отправка
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Вкладка: Настройки */}
                {activeTab === "settings" && (
                  <div>
                    <h2 className="mb-6 text-h2">Настройки компании</h2>
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Автоматическая нумерация</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <span>Включить автоматическую нумерацию документов</span>
                          </label>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Язык интерфейса</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="ru">Русский</option>
                            <option value="kg">Кыргызский</option>
                            <option value="en">English</option>
                            <option value="zh">中文</option>
                          </select>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}



