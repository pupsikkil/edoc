"use client"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Bell, Lock, Globe, Palette } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto bg-muted/40">
          <div className="container mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-h1 mb-2">Настройки</h1>
              <p className="text-muted-foreground text-body">
                Управление настройками системы и профиля
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-primary" />
                    <CardTitle>Уведомления</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Email-уведомления о новых документах</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>Push-уведомления в браузере</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>SMS-уведомления</span>
                  </label>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <CardTitle>Язык и регион</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Язык интерфейса</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="ru">Русский</option>
                      <option value="kg">Кыргызский</option>
                      <option value="en">English</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Часовой пояс</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="Asia/Bishkek">Азия/Бишкек (GMT+6)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-primary" />
                    <CardTitle>Тема оформления</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Светлая
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Тёмная
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Системная
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-primary" />
                    <CardTitle>Безопасность</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Смена пароля</label>
                    <Button variant="outline">Изменить пароль</Button>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Двухфакторная аутентификация</label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>Включить 2FA</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button variant="outline">Отмена</Button>
                <Button>Сохранить изменения</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}



