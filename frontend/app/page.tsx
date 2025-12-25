"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

interface NameEntry {
  id: number
  name: string
  created_at: string
}

export default function NameCapturePage() {
  const [names, setNames] = useState<NameEntry[]>([])
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const API_URL = "https://hellonames.netlify.app/api"

  useEffect(() => {
    fetchNames()
  }, [])

  const fetchNames = async () => {
    try {
      const res = await fetch(`${API_URL}/names`)
      const data = await res.json()
      setNames(data)
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/names`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      })
      if (res.ok) {
        const addedName = await res.json()
        setNames([addedName, ...names])
        setNewName("")
      }
    } catch (err) {
      console.error("Submit error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Hello Names</h1>
          <p className="text-slate-500">Capture and view names instantly.</p>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Add New Name</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Enter a name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-white"
                disabled={submitting}
              />
              <Button type="submit" disabled={submitting || !newName.trim()}>
                {submitting ? <Spinner className="w-4 h-4" /> : "Add"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider px-1">Recent Entries</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner className="w-6 h-6 text-slate-400" />
            </div>
          ) : names.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed text-slate-400">
              No names added yet
            </div>
          ) : (
            <div className="grid gap-3">
              {names.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center animate-in fade-in slide-in-from-bottom-2"
                >
                  <span className="font-medium text-slate-700">{entry.name}</span>
                  <span className="text-xs text-slate-400">{new Date(entry.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
