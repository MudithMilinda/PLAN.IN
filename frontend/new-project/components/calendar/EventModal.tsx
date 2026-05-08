import { AlignLeft, AlertCircle, Calendar, Check, Clock, Loader2, MapPin, Trash2, Users, X } from 'lucide-react';
import { CalendarEvent, NewEventData } from '@/types/calendar';
import { CALENDARS } from '@/utils/calendarHelpers';

interface EventModalProps {
  show: boolean;
  selectedDate: Date | null;
  newEvent: NewEventData;
  editingEventId: string | null;
  deletingId: string | null;
  googleConnected: boolean;
  savingEvent: boolean;
  overlapWarning: CalendarEvent | null;
  onClose: () => void;
  onChangeEvent: (next: NewEventData) => void;
  onChangeDate: (date: Date) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
  onClearOverlap: () => void;
}

export function EventModal({ show, selectedDate, newEvent, editingEventId, deletingId, googleConnected, savingEvent, overlapWarning, onClose, onChangeEvent, onChangeDate, onSave, onDelete, onClearOverlap }: EventModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-xl rounded-lg border border-gray-200 bg-white shadow-2xl">
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">{editingEventId ? 'Edit Event' : 'New Event'}</h3>
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${googleConnected ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-400'}`}><Calendar className="h-3 w-3" />{googleConnected ? 'Will sync to Google' : 'Google not connected'}</span>
              <button onClick={onClose} className="rounded p-1 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
          </div>

          {overlapWarning && (
            <div className="flex items-start gap-2 rounded border border-red-200 bg-red-50 p-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Event Overlap Detected!</p>
                <p className="mt-1 text-xs text-red-700">Conflicts with "{overlapWarning.title}" at {overlapWarning.startTime}</p>
              </div>
            </div>
          )}

          <input type="text" value={newEvent.title} autoFocus onChange={(e) => onChangeEvent({ ...newEvent, title: e.target.value })} className="w-full border-0 border-b border-gray-300 px-0 py-2 text-2xl text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500" placeholder="Add title" />
          <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-gray-500" /><input type="date" value={selectedDate?.toISOString().split('T')[0] || ''} onChange={(e) => onChangeDate(new Date(`${e.target.value}T12:00:00`))} className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none" /></div>

          {!newEvent.allDay && (
            <div className="ml-8 flex items-center gap-3">
              <input type="time" value={newEvent.startTime} onChange={(e) => { onChangeEvent({ ...newEvent, startTime: e.target.value }); onClearOverlap(); }} className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none" />
              <span className="text-gray-500">–</span>
              <input type="time" value={newEvent.endTime} onChange={(e) => { onChangeEvent({ ...newEvent, endTime: e.target.value }); onClearOverlap(); }} className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none" />
            </div>
          )}

          <div className="ml-8 flex items-center gap-3"><label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={newEvent.allDay} onChange={(e) => onChangeEvent({ ...newEvent, allDay: e.target.checked })} className="h-4 w-4 accent-indigo-600" /><span className="text-sm text-gray-700">All day</span></label></div>
          <div className="flex items-center gap-3"><Users className="h-5 w-5 text-gray-500" /><input type="text" value={newEvent.participants} placeholder="Add participants" onChange={(e) => onChangeEvent({ ...newEvent, participants: e.target.value })} className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none" /></div>
          <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-gray-500" /><input type="text" value={newEvent.location} placeholder="Add location" onChange={(e) => onChangeEvent({ ...newEvent, location: e.target.value })} className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none" /></div>
          <div className="flex items-center gap-3"><Check className="h-5 w-5 text-gray-500" /><input type="text" value={newEvent.category} placeholder="Event category / theme" onChange={(e) => onChangeEvent({ ...newEvent, category: e.target.value })} className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none" /></div>
          <div className="flex items-center gap-3"><div className="h-5 w-5 shrink-0" /><select value={newEvent.calendar} onChange={(e) => onChangeEvent({ ...newEvent, calendar: e.target.value })} className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none">{CALENDARS.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
          <div className="flex items-start gap-3"><AlignLeft className="mt-2 h-5 w-5 text-gray-500" /><textarea value={newEvent.description} placeholder="Add description / notes" onChange={(e) => onChangeEvent({ ...newEvent, description: e.target.value })} className="min-h-20 flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none" /></div>

          {googleConnected && (
            <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0" />
              <div><p className="font-medium">Google Calendar sync enabled</p><p className="mt-0.5 text-blue-600">The main event + all Weekly Content Calendar posts will be automatically added to your Google Calendar.</p></div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            {editingEventId && (
              <button onClick={() => onDelete(editingEventId)} disabled={deletingId === editingEventId} className="flex items-center gap-2 rounded bg-red-500 px-4 py-2 font-medium text-white transition-all hover:bg-red-600 disabled:opacity-60">
                {deletingId === editingEventId ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting…</> : <><Trash2 className="h-4 w-4" /> Delete</>}
              </button>
            )}
            <div className="ml-auto flex gap-3">
              <button onClick={onClose} className="rounded border-2 border-orange-500 px-6 py-2 font-medium text-orange-500 transition-all hover:bg-orange-50">Cancel</button>
              <button onClick={onSave} disabled={savingEvent || !newEvent.title} className="flex items-center gap-2 rounded bg-indigo-600 px-6 py-2 font-medium text-white transition-all hover:bg-indigo-700 disabled:opacity-60">{savingEvent && <Loader2 className="h-4 w-4 animate-spin" />}{savingEvent ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
