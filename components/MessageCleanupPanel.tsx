'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DatePicker } from './DatePicker'
import { deleteMessagesInRange, deleteAllMessages } from '@/lib/db/chatHistory'
import { checkOrCreateUser } from '@/app/actionts'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageCleanupPanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMessagesCleared: (filterFn?: (msg: any) => boolean) => void
}

export default function MessageCleanupPanel({ onMessagesCleared }: MessageCleanupPanelProps) {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [open, setOpen] = useState(false)

  const handleQuickDelete = async (rangeGetter: () => { start: Date; end: Date }) => {
    const user = await checkOrCreateUser()
    if (!user) return

    const { start, end } = rangeGetter()

    await deleteMessagesInRange(user.id, start.toISOString(), end.toISOString())

    onMessagesCleared?.((msg) => {
      const msgDate = new Date(msg.created_at)
      return msgDate < start || msgDate > end
    })
  }

  const handleDeleteAll = async () => {
    const user = await checkOrCreateUser()
    if (!user) return
    await deleteAllMessages(user.id)
    onMessagesCleared?.()
  }

  return (
    <div className="mb-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-sm transition hover:bg-muted"
          >
            <Trash2 size={16} className="text-red-500" />
            Sohbet Temizleme
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="space-y-4 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm mt-2">

            {/* Tümünü Temizle */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full text-sm">
                  Tüm Sohbeti Temizle
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tüm mesajları silmek istediğine emin misin?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                  <AlertDialogAction
                    asChild
                  >
                    <button onClick={handleDeleteAll}>Evet, sil</button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Hızlı Temizleme */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="text-xs" onClick={() => handleQuickDelete(getTodayRange)}>
                Bugünü Temizle
              </Button>
              <Button variant="outline" className="text-xs" onClick={() => handleQuickDelete(getTomorrowRange)}>
                Yarını Temizle
              </Button>
              <Button variant="outline" className="text-xs" onClick={() => handleQuickDelete(getThisWeekRange)}>
                Bu Haftayı Temizle
              </Button>
              <Button variant="outline" className="text-xs" onClick={() => handleQuickDelete(getThisMonthRange)}>
                Bu Ayı Temizle
              </Button>
            </div>

            {/* Tarih Aralığıyla Temizle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DatePicker label="Başlangıç" value={startDate} onChange={setStartDate} />
              <DatePicker label="Bitiş" value={endDate} onChange={setEndDate} />
            </div>

            <Button
              disabled={!startDate || !endDate}
              className="w-full text-sm bg-red-500 hover:bg-red-600 text-white"
              onClick={async () => {
                const user = await checkOrCreateUser()
                if (!user || !startDate || !endDate) return

                await deleteMessagesInRange(user.id, startDate.toISOString(), endDate.toISOString())

                onMessagesCleared?.((msg) => {
                  const msgDate = new Date(msg.created_at)
                  return msgDate < startDate || msgDate > endDate
                })
              }}
            >
              Tarih Aralığını Temizle
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function getTodayRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { start, end }
}

function getTomorrowRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { start, end }
}

function getThisWeekRange() {
  const now = new Date()
  const day = now.getDay() || 7
  const start = new Date(now)
  start.setDate(now.getDate() - day + 1)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  return { start, end }
}

function getThisMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return { start, end }
}
