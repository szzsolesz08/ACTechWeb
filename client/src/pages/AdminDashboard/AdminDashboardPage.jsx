import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import authService from '../../services/authService'
import bookingService from '../../services/bookingService'
import './AdminDashboardPage.css'

function AdminDashboardPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }

    fetchBookings()
  }, [navigate])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingService.getAllBookings()
      setBookings(response.bookings || [])
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const getMonthlySalesData = () => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const monthlySales = Array(12)
      .fill(0)
      .map((_, index) => ({
        month: monthNames[index],
        sales: 0,
        bookings: 0,
      }))

    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.date)
      const bookingYear = bookingDate.getFullYear()
      const bookingMonth = bookingDate.getMonth()

      if (
        bookingYear === selectedYear &&
        booking.status === 'completed' &&
        booking.price
      ) {
        monthlySales[bookingMonth].sales += Number(booking.price) || 0
        monthlySales[bookingMonth].bookings += 1
      }
    })

    return monthlySales
  }

  const getMonthlyStatusData = () => {
    const statuses = {
      pending: { name: 'Pending', count: 0, color: '#ffc107' },
      confirmed: { name: 'Confirmed', count: 0, color: '#17a2b8' },
      'in-progress': { name: 'In Progress', count: 0, color: '#007bff' },
      completed: { name: 'Completed', count: 0, color: '#28a745' },
      cancelled: { name: 'Cancelled', count: 0, color: '#dc3545' },
    }

    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.date)
      const bookingYear = bookingDate.getFullYear()
      const bookingMonth = bookingDate.getMonth()

      if (bookingYear === selectedYear && bookingMonth === selectedMonth) {
        if (statuses[booking.status]) {
          statuses[booking.status].count += 1
        }
      }
    })

    return Object.values(statuses)
  }

  const CustomSalesTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].payload.month}`}</p>
          <p className="sales">{`Sales: ${payload[0].value.toLocaleString('hu-HU')} Ft`}</p>
          <p className="bookings">{`Bookings: ${payload[0].payload.bookings}`}</p>
        </div>
      )
    }
    return null
  }

  const CustomStatusTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].payload.name}`}</p>
          <p className="count">{`Count: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  const monthlySalesData = getMonthlySalesData()
  const monthlyStatusData = getMonthlyStatusData()
  const totalYearlySales = monthlySalesData.reduce(
    (sum, month) => sum + Number(month.sales),
    0
  )
  const totalYearlyBookings = monthlySalesData.reduce(
    (sum, month) => sum + month.bookings,
    0
  )
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const years = [2024, 2025, 2026]

  return (
    <div className="admin-dashboard-page">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Dashboard</h1>
            <p>Analytics and insights for {selectedYear}</p>
          </div>
          <div className="year-selector">
            <label>Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>{Number(totalYearlySales).toLocaleString('hu-HU')} Ft</h3>
            <p>Total Sales ({selectedYear})</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>{totalYearlyBookings}</h3>
            <p>Completed Bookings</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>
              {totalYearlyBookings > 0
                ? Math.round(
                    Number(totalYearlySales) / Number(totalYearlyBookings)
                  ).toLocaleString('hu-HU')
                : 0}{' '}
              Ft
            </h3>
            <p>Average Booking Value</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <h3>{bookings.filter((b) => b.status === 'pending').length}</h3>
            <p>Pending Bookings</p>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h2>Monthly Sales - {selectedYear}</h2>
          <p>Completed bookings revenue by month</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={monthlySalesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" stroke="#6c757d" />
            <YAxis
              stroke="#6c757d"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomSalesTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#007bff"
              strokeWidth={3}
              dot={{ fill: '#007bff', r: 5 }}
              activeDot={{ r: 8 }}
              name="Sales (Ft)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h2>Booking Status Distribution</h2>
          <div className="month-selector">
            <label>Select Month: </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={monthlyStatusData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#6c757d" />
            <YAxis stroke="#6c757d" />
            <Tooltip content={<CustomStatusTooltip />} />
            <Legend />
            <Bar
              dataKey="count"
              name="Number of Bookings"
              radius={[8, 8, 0, 0]}
            >
              {monthlyStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AdminDashboardPage
