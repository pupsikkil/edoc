# 🔌 Руководство по интеграции Frontend с Backend API

## 📋 Содержание

- [Быстрый старт](#быстрый-старт)
- [Настройка](#настройка)
- [Использование API клиента](#использование-api-клиента)
- [Примеры использования](#примеры-использования)
- [Обработка ошибок](#обработка-ошибок)
- [Обновление токенов](#обновление-токенов)

---

## 🚀 Быстрый старт

### 1. Запустите Backend

Убедитесь что backend запущен и доступен на `http://localhost:8000`:

```bash
cd backend
uvicorn app.main:app --reload
```

### 2. Запустите Frontend

```bash
npm run dev
```

Frontend будет доступен на `http://localhost:3000`

---

## ⚙️ Настройка

### Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

По умолчанию используется `http://localhost:8000`, если переменная не установлена.

---

## 📦 Использование API клиента

API клиент находится в `lib/api.ts` и экспортирует методы для работы с backend.

### Импорт API методов

```typescript
import { authAPI, documentsAPI, partnersAPI } from '@/lib/api'
```

### Структура API клиента

- **authAPI** - авторизация и регистрация
- **documentsAPI** - управление документами
- **partnersAPI** - управление контрагентами
- **companiesAPI** - управление профилем компании
- **filesAPI** - загрузка/скачивание файлов
- **signatureAPI** - работа с ЭЦП

---

## 📝 Примеры использования

### Авторизация

```typescript
import { authAPI } from '@/lib/api'

// Вход в систему
const login = async (email: string, password: string) => {
  try {
    const response = await authAPI.login({ email, password })
    console.log('Токены сохранены:', response.access_token)
  } catch (error) {
    console.error('Ошибка авторизации:', error)
  }
}

// Регистрация
const register = async (data: {
  email: string
  password: string
  full_name: string
  company_name: string
  inn: string
}) => {
  try {
    const response = await authAPI.register(data)
    console.log('Регистрация успешна')
  } catch (error) {
    console.error('Ошибка регистрации:', error)
  }
}

// Получение текущего пользователя
const getMe = async () => {
  try {
    const user = await authAPI.getCurrentUser()
    console.log('Текущий пользователь:', user)
  } catch (error) {
    console.error('Ошибка получения пользователя:', error)
  }
}
```

### Работа с документами

```typescript
import { documentsAPI } from '@/lib/api'

// Получить все документы
const getAllDocuments = async () => {
  try {
    const documents = await documentsAPI.getAll({
      skip: 0,
      limit: 20,
      status: 'draft'
    })
    console.log('Документы:', documents)
  } catch (error) {
    console.error('Ошибка получения документов:', error)
  }
}

// Получить документ по ID
const getDocument = async (id: number) => {
  try {
    const document = await documentsAPI.getById(id)
    console.log('Документ:', document)
  } catch (error) {
    console.error('Ошибка получения документа:', error)
  }
}

// Создать документ
const createDocument = async () => {
  try {
    const document = await documentsAPI.create({
      number: 'ДОГ-2024-001',
      document_type: 'contract',
      amount: 100000,
      currency: 'сом',
    })
    console.log('Документ создан:', document)
  } catch (error) {
    console.error('Ошибка создания документа:', error)
  }
}

// Обновить документ
const updateDocument = async (id: number) => {
  try {
    const document = await documentsAPI.update(id, {
      status: 'signed',
      amount: 150000,
    })
    console.log('Документ обновлён:', document)
  } catch (error) {
    console.error('Ошибка обновления документа:', error)
  }
}

// Удалить документ
const deleteDocument = async (id: number) => {
  try {
    await documentsAPI.delete(id)
    console.log('Документ удалён')
  } catch (error) {
    console.error('Ошибка удаления документа:', error)
  }
}
```

### Работа с контрагентами

```typescript
import { partnersAPI } from '@/lib/api'

// Получить всех контрагентов
const getAllPartners = async () => {
  try {
    const partners = await partnersAPI.getAll()
    console.log('Контрагенты:', partners)
  } catch (error) {
    console.error('Ошибка получения контрагентов:', error)
  }
}

// Создать контрагента
const createPartner = async () => {
  try {
    const partner = await partnersAPI.create({
      partner_name: 'ООО «Пример»',
      partner_inn: '12345678901234',
      partner_email: 'example@example.com',
      partner_phone: '+996 555 123456',
    })
    console.log('Контрагент создан:', partner)
  } catch (error) {
    console.error('Ошибка создания контрагента:', error)
  }
}
```

### Загрузка файлов

```typescript
import { filesAPI } from '@/lib/api'

// Загрузить файл
const uploadFile = async (file: File) => {
  try {
    const response = await filesAPI.upload(file)
    console.log('Файл загружен:', response)
  } catch (error) {
    console.error('Ошибка загрузки файла:', error)
  }
}

// Скачать файл
const downloadFile = async (fileId: string) => {
  try {
    const blob = await filesAPI.download(fileId)
    // Создать ссылку для скачивания
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'file.pdf'
    link.click()
  } catch (error) {
    console.error('Ошибка скачивания файла:', error)
  }
}
```

### Работа с ЭЦП

```typescript
import { signatureAPI } from '@/lib/api'

// Загрузить сертификат
const uploadCertificate = async (file: File, password: string) => {
  const formData = new FormData()
  formData.append('certificate', file)
  formData.append('password', password)
  
  try {
    const response = await signatureAPI.uploadCertificate(formData)
    console.log('Сертификат загружен:', response)
  } catch (error) {
    console.error('Ошибка загрузки сертификата:', error)
  }
}

// Подписать документ
const signDocument = async (documentId: number, password: string) => {
  try {
    const response = await signatureAPI.signDocument(documentId, password)
    console.log('Документ подписан:', response)
  } catch (error) {
    console.error('Ошибка подписания документа:', error)
  }
}

// Проверить подпись
const verifySignature = async (documentId: number) => {
  try {
    const response = await signatureAPI.verifySignature(documentId)
    console.log('Подпись валидна:', response.is_valid)
  } catch (error) {
    console.error('Ошибка проверки подписи:', error)
  }
}
```

---

## ⚠️ Обработка ошибок

Все методы API могут выбрасывать исключения. Рекомендуется обрабатывать их в try-catch:

```typescript
try {
  const documents = await documentsAPI.getAll()
} catch (error: any) {
  if (error.response) {
    // Ошибка от backend
    console.error('Статус:', error.response.status)
    console.error('Данные:', error.response.data)
  } else if (error.request) {
    // Запрос отправлен, но ответа нет
    console.error('Нет ответа от сервера')
  } else {
    // Другая ошибка
    console.error('Ошибка:', error.message)
  }
}
```

### Стандартные HTTP коды ошибок

- **400** - Неверный запрос
- **401** - Не авторизован (токен недействителен)
- **403** - Доступ запрещён
- **404** - Не найдено
- **500** - Внутренняя ошибка сервера

---

## 🔄 Обновление токенов

API клиент автоматически обновляет токены через interceptors:

1. При получении ошибки **401**, клиент пытается обновить токен
2. Если обновление успешно, запрос повторяется автоматически
3. Если обновление не удалось, пользователь перенаправляется на страницу логина

### Использование утилит из lib/auth.ts

```typescript
import { login, register, logout, getCurrentUser } from '@/lib/auth'

// Вход - автоматически сохраняет токены
await login(email, password)

// Регистрация - автоматически сохраняет токены
await register({
  email,
  password,
  full_name: 'Иван Иванов',
  company_name: 'ООО «Пример»',
  inn: '12345678901234',
})

// Выход - очищает токены и перенаправляет на логин
logout()

// Получить текущего пользователя
const user = await getCurrentUser()
```

---

## 🔧 Настройка интерсепторов

Если нужно добавить свою логику в interceptors, отредактируйте `lib/api.ts`:

```typescript
// Добавить дополнительный заголовок ко всем запросам
apiClient.interceptors.request.use((config) => {
  config.headers['X-Custom-Header'] = 'value'
  return config
})

// Обработка всех ответов
apiClient.interceptors.response.use(
  (response) => {
    // Успешный ответ
    return response
  },
  (error) => {
    // Ошибка
    return Promise.reject(error)
  }
)
```

---

## 📚 Дополнительная документация

- Backend API документация: `http://localhost:8000/docs` (Swagger UI)
- Модели данных: `backend/app/models.py`
- Схемы данных: `backend/app/schemas.py`

---

## 🐛 Решение проблем

### Ошибка "Network Error"

- Убедитесь что backend запущен на `http://localhost:8000`
- Проверьте переменную `NEXT_PUBLIC_API_URL` в `.env.local`

### Ошибка "401 Unauthorized"

- Проверьте что токены сохранены в localStorage
- Войдите в систему снова через `/login`

### Ошибка CORS

- Убедитесь что в backend настроен CORS:
  ```python
  allowed_origins = ["http://localhost:3000"]
  ```

### Не обновляются данные

- Очистите кеш браузера
- Проверьте что токен не истёк
- Убедитесь что backend возвращает правильный формат данных

