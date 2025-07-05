'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'

type Transaction = {
  _id?: string
  amount: number
  description: string
  date: string
}

export default function Home() {
  const [form, setForm] = useState<Transaction>({ amount: 0, description: '', date: '' })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    const res = await fetch('/api/transactions')
    const data = await res.json()
    setTransactions(data)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.amount || !form.description || !form.date) return alert('All fields required.')
    setLoading(true)

    if (editingId) {
      // Edit mode
      const res = await fetch(`/api/transactions/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const updated = await res.json()
      setTransactions(transactions.map(txn => (txn._id === editingId ? updated : txn)))
      setEditingId(null)
    } else {
      // Add mode
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const newTxn = await res.json()
      setTransactions([newTxn, ...transactions])
    }

    setForm({ amount: 0, description: '', date: '' })
    setLoading(false)
  }

  const handleEdit = (txn: Transaction) => {
    setForm({
      amount: txn.amount,
      description: txn.description,
      date: txn.date.slice(0, 10)
    })
    setEditingId(txn._id || null)
  }

  const handleDelete = async (_id?: string) => {
    if (!_id) return
    await fetch(`/api/transactions/${_id}`, { method: 'DELETE' })
    setTransactions(transactions.filter(txn => txn._id !== _id))
  }

  const monthlyData = transactions.reduce((acc: any, txn) => {
    const month = format(parseISO(txn.date), 'MMM yyyy')
    if (!acc[month]) acc[month] = 0
    acc[month] += txn.amount
    return acc
  }, {})

  const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount
  }))

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">💸 Personal Finance Tracker</h1>

      {/* Form */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {editingId ? (loading ? 'Updating...' : 'Update Transaction') : loading ? 'Adding...' : 'Add Transaction'}
          </Button>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg mb-4">📊 Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-2">
        <h2 className="font-semibold text-lg">🧾 Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map(txn => (
            <Card key={txn._id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">₹{txn.amount}</p>
                  <p className="text-sm text-muted-foreground">{txn.description}</p>
                  <p className="text-xs text-gray-400">{format(parseISO(txn.date), 'dd MMM yyyy')}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(txn)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(txn._id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
