'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'

const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Salary', 'Other']


type Transaction = {
  _id?: string
  amount: number
  description: string
  date: string
  category: string
}

export default function Home() {
  const [form, setForm] = useState<Transaction>({ amount: 0, description: '', date: '', category: 'Other' })
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
      const res = await fetch(`/api/transactions/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const updated = await res.json()
      setTransactions(transactions.map(txn => (txn._id === editingId ? updated : txn)))
      setEditingId(null)
    } else {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const newTxn = await res.json()
      setTransactions([newTxn, ...transactions])
    }

    setForm({ amount: 0, description: '', date: '' , category: 'Other' })
    setLoading(false)
  }

  const handleEdit = (txn: Transaction) => {
    setForm({
      amount: txn.amount,
      description: txn.description,
      date: txn.date.slice(0, 10),
      category: txn.category || 'Other'
    })
    
    setEditingId(txn._id || null)
  }

  const handleDelete = async (_id?: string) => {
    if (!_id) return
    await fetch(`/api/transactions/${_id}`, { method: 'DELETE' })
    setTransactions(transactions.filter(txn => txn._id !== _id))
  }

  const monthlyData = transactions.reduce((acc: Record<string, number>, txn) => {
    const month = format(parseISO(txn.date), 'MMM yyyy')
    if (!acc[month]) acc[month] = 0
    acc[month] += txn.amount
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount
  }))

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-4xl font-bold text-center">💸 Personal Finance Tracker</h1>

      {/* Form Section */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Transaction' : 'Add New Transaction'}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Groceries"
            />
          </div>
          <div>
  <Label>Category</Label>
  <select
    name="category"
    value={form.category}
    onChange={handleChange}
    className="w-full border rounded-md p-2"
  >
    {categories.map(cat => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </select>
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
          <div className="md:col-span-3">
            <Button className="w-full" onClick={handleSubmit} disabled={loading}>
              {editingId ? (loading ? 'Updating...' : 'Update Transaction') : loading ? 'Adding...' : 'Add Transaction'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle>📊 Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {chartData.length === 0 ? (
            <p className="text-center text-muted-foreground">No transactions to show.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Transaction List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">🧾 Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-sm">No transactions found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {transactions.map(txn => (
              <Card key={txn._id} className="shadow-sm border border-gray-200">
                <CardContent className="p-4 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-green-600">₹{txn.amount}</p>
                    <p className="text-xs text-gray-400">{format(parseISO(txn.date), 'dd MMM yyyy')}</p>
                  </div>
                  <p className="text-sm">{txn.description}</p>
                  <div className="flex gap-2 pt-3">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(txn)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(txn._id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
