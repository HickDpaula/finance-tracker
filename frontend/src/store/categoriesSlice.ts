import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../services/categoryService'
import { ApiError } from '../services/httpClient'
import type { Category, CategoryRequest } from '../types/category'
import type { RootState } from './index'

interface CategoriesState {
  items: Category[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: CategoriesState = {
  items: [],
  status: 'idle',
}

function toMessage(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback
}

export const fetchCategoriesThunk = createAsyncThunk('categories/fetchAll', () => getCategories())

export const createCategoryThunk = createAsyncThunk<Category, CategoryRequest, { rejectValue: string }>(
  'categories/create',
  async (data, { rejectWithValue }) => {
    try {
      return await createCategory(data)
    } catch (err) {
      return rejectWithValue(toMessage(err, 'Não foi possível criar a categoria.'))
    }
  },
)

export const updateCategoryThunk = createAsyncThunk<
  Category,
  { id: string; data: CategoryRequest },
  { rejectValue: string }
>('categories/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateCategory(id, data)
  } catch (err) {
    return rejectWithValue(toMessage(err, 'Não foi possível editar a categoria.'))
  }
})

export const deleteCategoryThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategory(id)
      return id
    } catch (err) {
      return rejectWithValue(toMessage(err, 'Não foi possível excluir a categoria.'))
    }
  },
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCategoriesThunk.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.items.push(action.payload)
        state.items.sort((a, b) => a.name.localeCompare(b.name))
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        state.items.sort((a, b) => a.name.localeCompare(b.name))
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload)
      })
  },
})

export default categoriesSlice.reducer

export const selectCategories = (state: RootState) => state.categories.items
export const selectCategoriesStatus = (state: RootState) => state.categories.status
