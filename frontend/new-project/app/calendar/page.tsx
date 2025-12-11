'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, AlertCircle, Clock, MapPin, Users, AlignLeft, Check } from 'lucide-react';
import { SidebarDemo } from '@/components/layout/Sidebar';

interface Event {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  allDay: boolean;
  calendar: string;
  participants: string;
  location: string;
  description: string;
}

interface NewEventData {
  title: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  calendar: string;
  participants: string;
  location: string;
  description: string;
}

export default function InteractiveCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [selectedCalendar, setSelectedCalendar] = useState<string>('my-calendar');
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Parinamaya Live Concert',
      date: new Date(2025, 10, 23),
      startTime: '14:00',
      endTime: '16:00',
      allDay: false,
      calendar: 'my-calendar',
      participants: '',
      location: '',
      description: ''
    },
    {
      id: 2,
      title: 'Team Meeting',
      date: new Date(2025, 10, 25),
      startTime: '10:00',
      endTime: '11:00',
      allDay: false,
      calendar: 'work',
      participants: '',
      location: '',
      description: ''
    }
  ]);
  const [newEvent, setNewEvent] = useState<NewEventData>({
    title: '',
    startTime: '',
    endTime: '',
    allDay: false,
    calendar: 'my-calendar',
    participants: '',
    location: '',
    description: ''
  });
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [overlapWarning, setOverlapWarning] = useState<Event | null>(null);
  const [activeCalendars, setActiveCalendars] = useState<Record<string, boolean>>({
    'my-calendar': true,
    'work': true,
    'fun': true,
    'family': true,
    'important': true,
    'selected': true
  });

  const calendars = [
    { id: 'my-calendar', name: 'My calendar', color: 'bg-yellow-500', icon: '📅' },
    { id: 'work', name: 'Work', color: 'bg-teal-500', icon: '💼' },
    { id: 'fun', name: 'Fun', color: 'bg-green-500', icon: '⭐' },
    { id: 'family', name: 'Family', color: 'bg-purple-500', icon: '🐕' },
    { id: 'important', name: 'Important', color: 'bg-red-500', icon: '🎈' },
    { id: 'selected', name: 'Selected events', color: 'bg-gray-400', icon: '📋' }
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: prevMonthDay.getDate(), isCurrentMonth: false, fullDate: prevMonthDay });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, isCurrentMonth: true, fullDate: new Date(year, month, i) });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: i, isCurrentMonth: false, fullDate: new Date(year, month + 1, i) });
    }

    return days;
  };

  const getEventsForDate = (fullDate: Date | null) => {
    if (!fullDate) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const isActiveCalendar = activeCalendars[event.calendar];
      return isActiveCalendar &&
             eventDate.getDate() === fullDate.getDate() &&
             eventDate.getMonth() === fullDate.getMonth() &&
             eventDate.getFullYear() === fullDate.getFullYear();
    });
  };

  const checkEventOverlap = (newEventData: NewEventData): Event | null => {
    if (!selectedDate || !newEventData.startTime || newEventData.allDay) return null;

    const dayEvents = getEventsForDate(selectedDate).filter(e => !e.allDay);
    
    const newStart = new Date(selectedDate);
    const [startHours, startMinutes] = newEventData.startTime.split(':');
    newStart.setHours(parseInt(startHours), parseInt(startMinutes));
    
    const newEnd = new Date(selectedDate);
    const [endHours, endMinutes] = newEventData.endTime.split(':');
    newEnd.setHours(parseInt(endHours), parseInt(endMinutes));

    for (const event of dayEvents) {
      const eventStart = new Date(event.date);
      const [eStartHours, eStartMinutes] = event.startTime.split(':');
      eventStart.setHours(parseInt(eStartHours), parseInt(eStartMinutes));
      
      const eventEnd = new Date(event.date);
      const [eEndHours, eEndMinutes] = event.endTime.split(':');
      eventEnd.setHours(parseInt(eEndHours), parseInt(eEndMinutes));

      if (
        (newStart >= eventStart && newStart < eventEnd) ||
        (newEnd > eventStart && newEnd <= eventEnd) ||
        (newStart <= eventStart && newEnd >= eventEnd)
      ) {
        return event;
      }
    }
    return null;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (fullDate: Date | null) => {
    if (fullDate) {
      // Create a new date at noon to avoid timezone issues
      const selectedDateAtNoon = new Date(fullDate.getFullYear(), fullDate.getMonth(), fullDate.getDate(), 12, 0, 0);
      setSelectedDate(selectedDateAtNoon);
      setShowEventModal(true);
      setOverlapWarning(null);
      setEditingEventId(null);
      setNewEvent({
        title: '',
        startTime: '',
        endTime: '',
        allDay: false,
        calendar: selectedCalendar,
        participants: '',
        location: '',
        description: ''
      });
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && selectedDate) {
      if (!newEvent.allDay) {
        const overlap = checkEventOverlap(newEvent);
        if (overlap && overlap.id !== editingEventId) {
          setOverlapWarning(overlap);
          return;
        }
      }

      if (editingEventId) {
        // Update existing event
        setEvents(events.map(event => 
          event.id === editingEventId 
            ? {
                ...event,
                title: newEvent.title,
                date: selectedDate,
                startTime: newEvent.startTime || '00:00',
                endTime: newEvent.endTime || '01:00',
                allDay: newEvent.allDay,
                calendar: newEvent.calendar,
                participants: newEvent.participants,
                location: newEvent.location,
                description: newEvent.description
              }
            : event
        ));
      } else {
        // Add new event
        setEvents([...events, {
          id: Date.now(),
          title: newEvent.title,
          date: selectedDate,
          startTime: newEvent.startTime || '00:00',
          endTime: newEvent.endTime || '01:00',
          allDay: newEvent.allDay,
          calendar: newEvent.calendar,
          participants: newEvent.participants,
          location: newEvent.location,
          description: newEvent.description
        }]);
      }
      
      setNewEvent({
        title: '',
        startTime: '',
        endTime: '',
        allDay: false,
        calendar: selectedCalendar,
        participants: '',
        location: '',
        description: ''
      });
      setShowEventModal(false);
      setOverlapWarning(null);
      setEditingEventId(null);
    }
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId));
    setShowEventModal(false);
    setEditingEventId(null);
  };

  const handleEditEvent = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(new Date(event.date));
    setNewEvent({
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      allDay: event.allDay,
      calendar: event.calendar,
      participants: event.participants || '',
      location: event.location || '',
      description: event.description || ''
    });
    setEditingEventId(event.id);
    setShowEventModal(true);
    setOverlapWarning(null);
  };

  const toggleCalendar = (calendarId: string) => {
    setActiveCalendars({
      ...activeCalendars,
      [calendarId]: !activeCalendars[calendarId]
    });
  };

  const isToday = (fullDate: Date) => {
    const today = new Date();
    return fullDate.getDate() === today.getDate() &&
           fullDate.getMonth() === today.getMonth() &&
           fullDate.getFullYear() === today.getFullYear();
  };

  const days = getDaysInMonth(currentDate);
  const miniDays = getDaysInMonth(currentDate);

  const CalendarContent = () => (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-950 p-4 flex flex-col">
        {/* New Event Button */}
        <button
          onClick={() => {
            setSelectedDate(new Date());
            setShowEventModal(true);
          }}
          className="mb-6 px-4 py-3 bg-indigo-800 hover:bg-indigo-700 text-indigo-100 rounded-full shadow-md flex items-center gap-3 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New event</span>
        </button>

        {/* Mini Calendar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-indigo-100">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <div className="flex gap-1">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-indigo-800 rounded">
                <ChevronLeft className="w-4 h-4 text-indigo-200" />
              </button>
              <button onClick={handleNextMonth} className="p-1 hover:bg-indigo-800 rounded">
                <ChevronRight className="w-4 h-4 text-indigo-200" />
              </button>
            </div>
          </div>

          {/* Mini Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-center text-indigo-300 font-medium py-1">
                {day}
              </div>
            ))}
            {miniDays.map((day, index) => {
              const isTodayDate = isToday(day.fullDate);
              return (
                <div
                  key={index}
                  className={`
                    text-center py-1 rounded-full cursor-pointer text-xs
                    ${day.isCurrentMonth ? 'text-indigo-100' : 'text-indigo-500'}
                    ${isTodayDate ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-indigo-800'}
                  `}
                  onClick={() => handleDateClick(day.fullDate)}
                >
                  {day.date}
                </div>
              );
            })}
          </div>
        </div>

        {/* My Calendars */}
        <div className="flex-1 overflow-y-auto">
          <div className="mb-2 text-xs font-semibold text-indigo-300 flex items-center justify-between">
            <button className="flex items-center gap-1 hover:text-indigo-100">
              <ChevronLeft className="w-3 h-3 -rotate-90" />
              <span>MY CALENDARS</span>
            </button>
          </div>
          
          <div className="space-y-1">
            {calendars.map(cal => (
              <div
                key={cal.id}
                className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-indigo-800 cursor-pointer"
                onClick={() => toggleCalendar(cal.id)}
              >
                <div className={`w-3 h-3 rounded-sm ${cal.color} flex items-center justify-center`}>
                  {activeCalendars[cal.id] && <Check className="w-2 h-2 text-white" />}
                </div>
                <span className="text-sm flex-1 text-indigo-100">{cal.name}</span>
                <span className="text-xs">{cal.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <button
              onClick={handleToday}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2 transition-all"
            >
              <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center text-xs">
                {new Date().getDate()}
              </div>
              Today
            </button>
            <div className="flex gap-1">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <h2 className="text-xl font-normal text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="grid grid-cols-7 border-t border-l border-gray-200">
            {/* Day Headers */}
            {daysOfWeek.map((day, index) => (
              <div key={day} className={`border-r border-b border-gray-200 bg-white p-3 text-center text-sm font-medium ${index === 1 ? 'text-indigo-600' : 'text-gray-700'}`}>
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day.fullDate);
              const isTodayDate = isToday(day.fullDate);
              const isSelected = selectedDate && 
                day.fullDate.getDate() === selectedDate.getDate() &&
                day.fullDate.getMonth() === selectedDate.getMonth() &&
                day.fullDate.getFullYear() === selectedDate.getFullYear();

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day.fullDate)}
                  className={`border-r border-b border-gray-200 p-2 min-h-32 cursor-pointer hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-indigo-50 border-2 border-indigo-400' : 'bg-white'
                  } ${
                    !day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'
                  }`}
                >
                  <div 
                    className={`text-sm font-medium mb-1 ${isTodayDate ? 'bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''}`}
                  >
                    {day.date}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map(event => {
                      const cal = calendars.find(c => c.id === event.calendar);
                      return (
                        <div
                          key={event.id}
                          onClick={(e) => handleEditEvent(event, e)}
                          className={`text-xs px-1.5 py-0.5 rounded ${cal?.color} text-white truncate hover:opacity-80 cursor-pointer transition-opacity`}
                        >
                          {event.allDay ? event.title : `${event.startTime} ${event.title}`}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl border border-gray-200">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingEventId ? 'Edit Event' : 'New Event'}
                </h3>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setOverlapWarning(null);
                    setEditingEventId(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {overlapWarning && (
                <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium text-sm">Event Overlap Detected!</p>
                    <p className="text-red-700 text-xs mt-1">
                      Conflicts with "{overlapWarning.title}" at {overlapWarning.startTime}
                    </p>
                  </div>
                </div>
              )}

              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full text-2xl border-0 border-b border-gray-300 focus:border-indigo-500 outline-none px-0 py-2 text-gray-900 placeholder-gray-400"
                placeholder="Add title"
              />

              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  value={selectedDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 text-gray-900"
                />
              </div>

              {!newEvent.allDay && (
                <div className="flex items-center gap-3 ml-8 text-gray-700">
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => {
                      setNewEvent({ ...newEvent, startTime: e.target.value });
                      setOverlapWarning(null);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 text-gray-900"
                  />
                  <span className="text-gray-500">–</span>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => {
                      setNewEvent({ ...newEvent, endTime: e.target.value });
                      setOverlapWarning(null);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 text-gray-900"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 ml-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEvent.allDay}
                    onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 border-indigo-300 rounded accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">All day</span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={newEvent.participants}
                  onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                  placeholder="Add participants"
                />
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                  placeholder="Add location"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 shrink-0"></div>
                <select
                  value={newEvent.calendar}
                  onChange={(e) => setNewEvent({ ...newEvent, calendar: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 text-gray-900"
                >
                  {calendars.map(cal => (
                    <option key={cal.id} value={cal.id}>
                      {cal.icon} {cal.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-start gap-3">
                <AlignLeft className="w-5 h-5 text-gray-500 mt-2" />
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 min-h-24 text-gray-900 placeholder-gray-400"
                  placeholder="Add description"
                />
              </div>

              <div className="flex justify-between items-center gap-3 pt-4">
                {editingEventId && (
                  <button
                    onClick={() => handleDeleteEvent(editingEventId)}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium transition-all"
                  >
                    Delete
                  </button>
                )}
                <div className="flex gap-3 ml-auto">
                  <button
                    onClick={() => {
                      setShowEventModal(false);
                      setEditingEventId(null);
                    }}
                    className="px-6 py-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 rounded font-medium transition-all"
                  >
                    More options
                  </button>
                  <button
                    onClick={handleAddEvent}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <SidebarDemo>
      <CalendarContent />
    </SidebarDemo>
  );
}