import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCategories } from '../services/categoryService'
import type { Category } from '../types/category'
import type { RootState } from './index'

interface CategoriesState {
  items: Category[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: CategoriesState = {
  items: [],
  status: 'idle',
}

export const fetchCategoriesThunk = createAsyncThunk('categories/fetchAll', () => getCategories())

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
  },
})

export default categoriesSlice.reducer

export const selectCategories = (state: RootState) => state.categories.items
export const selectCategoriesStatus = (state: RootState) => state.categories.status
