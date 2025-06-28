"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { taskApi, powerSystemApi, journalApi, userApi, problemApi, behaviorApi } from './api'
import type { Task, PowerSystemTodo, JournalEntry, UserStats } from './api'

// Task hooks
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskApi.getTasks(),
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; completed?: boolean } }) =>
      taskApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
    },
  })
}

// Power System hooks
export function usePowerSystemTodos(params?: { category?: string; date?: string }) {
  return useQuery({
    queryKey: ['power-system-todos', params],
    queryFn: () => powerSystemApi.getPowerSystemTodos(params),
  })
}

export function useCreatePowerSystemTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: powerSystemApi.createPowerSystemTodo,
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['power-system-todos'] })
      
      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['power-system-todos'])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['power-system-todos'], (old: any) => {
        if (!old?.powerSystemTodos) return { powerSystemTodos: [{ id: 'temp-' + Date.now(), ...newTodo, completed: false }] }
        
        return {
          ...old,
          powerSystemTodos: [...old.powerSystemTodos, { id: 'temp-' + Date.now(), ...newTodo, completed: false }]
        }
      })
      
      // Return a context object with the snapshotted value
      return { previousTodos }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTodos) {
        queryClient.setQueryData(['power-system-todos'], context.previousTodos)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['power-system-todos'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
    },
  })
}

export function useUpdatePowerSystemTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: { title?: string; category?: string; completed?: boolean; date?: string } 
    }) => powerSystemApi.updatePowerSystemTodo(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['power-system-todos'] })
      
      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['power-system-todos'])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['power-system-todos'], (old: any) => {
        if (!old?.powerSystemTodos) return old
        
        return {
          ...old,
          powerSystemTodos: old.powerSystemTodos.map((todo: any) =>
            todo.id === id ? { ...todo, ...data } : todo
          )
        }
      })
      
      // Return a context object with the snapshotted value
      return { previousTodos }
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTodos) {
        queryClient.setQueryData(['power-system-todos'], context.previousTodos)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['power-system-todos'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
    },
  })
}

// Journal hooks
export function useJournalEntries(params?: { date?: string; limit?: number }) {
  return useQuery({
    queryKey: ['journal-entries', params],
    queryFn: () => journalApi.getJournalEntries(params),
  })
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: journalApi.createJournalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] })
    },
  })
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { notes?: string; mood?: number } }) =>
      journalApi.updateJournalEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] })
    },
  })
}

// User hooks
export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userApi.getProfile(),
  })
}

export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: () => userApi.getStats(),
  })
}

// Problem solving hooks
export function useProblems(params?: { category?: string; limit?: number }) {
  return useQuery({
    queryKey: ['problems', params],
    queryFn: () => problemApi.getProblems(params),
  })
}

export function useCreateProblem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: problemApi.createProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
    },
  })
}

// Behavior hooks
export function useBehaviors(params?: { date?: string; limit?: number }) {
  return useQuery({
    queryKey: ['behaviors', params],
    queryFn: () => behaviorApi.getBehaviors(params),
  })
}

export function useCreateBehavior() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: behaviorApi.createBehavior,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['behaviors'] })
    },
  })
}
