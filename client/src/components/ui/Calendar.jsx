import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import './Calendar.css';

const Calendar = ({ 
  selectedDate, 
  onDateSelect, 
  availableDates = [], 
  disabled = false 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateState, setSelectedDateState] = useState(selectedDate);

  useEffect(() => {
    setSelectedDateState(selectedDate);
  }, [selectedDate]);

  // Generar fechas del mes actual
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generar 42 días (6 semanas) para cubrir todo el mes
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Verificar si una fecha está disponible
  const isDateAvailable = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return availableDates.some(availableDate => availableDate.date === dateString);
  };

  // Verificar si una fecha está en el pasado
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Verificar si una fecha es del mes actual
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  };

  // Verificar si una fecha es hoy
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Verificar si una fecha está seleccionada
  const isSelected = (date) => {
    if (!selectedDateState) return false;
    return date.toDateString() === selectedDateState.toDateString();
  };

  // Navegar al mes anterior
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  // Navegar al mes siguiente
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  // Seleccionar una fecha
  const handleDateClick = (date) => {
    if (disabled || !isDateAvailable(date) || isPastDate(date)) return;
    
    setSelectedDateState(date);
    onDateSelect(date);
  };

  // Obtener nombre del mes
  const getMonthName = (date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  // Obtener nombre corto del día de la semana
  const getDayName = (dayIndex) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[dayIndex];
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="calendar-container">
      {/* Header del calendario */}
      <div className="calendar-header">
        <button 
          className="calendar-nav-btn"
          onClick={goToPreviousMonth}
          disabled={disabled}
        >
          <ChevronLeft size={20} />
        </button>
        
        <h3 className="calendar-month-title">
          {getMonthName(currentMonth)}
        </h3>
        
        <button 
          className="calendar-nav-btn"
          onClick={goToNextMonth}
          disabled={disabled}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="calendar-weekdays">
        {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
          <div key={dayIndex} className="calendar-weekday">
            {getDayName(dayIndex)}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div className="calendar-days">
        {calendarDays.map((date, index) => {
          const available = isDateAvailable(date);
          const past = isPastDate(date);
          const currentMonthDay = isCurrentMonth(date);
          const today = isToday(date);
          const selected = isSelected(date);
          
          return (
            <button
              key={index}
              className={`calendar-day ${
                !currentMonthDay ? 'other-month' : ''
              } ${
                past ? 'past' : ''
              } ${
                available ? 'available' : ''
              } ${
                today ? 'today' : ''
              } ${
                selected ? 'selected' : ''
              }`}
              onClick={() => handleDateClick(date)}
              disabled={disabled || past || !available}
              title={
                available 
                  ? `Disponible: ${date.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}`
                  : 'Fecha no disponible'
              }
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot available"></span>
          <span>Disponible</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot selected"></span>
          <span>Seleccionada</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot today"></span>
          <span>Hoy</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
