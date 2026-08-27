import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CategoryForm } from '../components/categories/CategoryForm'
import {
  createCategoryThunk,
  deleteCategoryThunk,
  fetchCategoriesThunk,
  selectCategories,
  selectCategoriesStatus,
  updateCategoryThunk,
} from '../store/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { Category } from '../types/category'

export function CategoriesPage() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)
  const status = useAppSelector(selectCategoriesStatus)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategoriesThunk())
    }
  }, [dispatch, status])

  function openCreateForm() {
    setEditingCategory(undefined)
    setIsFormOpen(true)
  }

  function openEditForm(category: Category) {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  async function handleDelete(category: Category) {
    if (!window.confirm(`Excluir a categoria "${category.name}"?`)) {
      return
    }
    setDeleteError(null)
    try {
      await dispatch(deleteCategoryThunk(category.id)).unwrap()
    } catch (err) {
      setDeleteError(typeof err === 'string' ? err : 'Não foi possível excluir a categoria.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Categories</h1>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-md bg-[#3987e5] px-4 py-2 text-sm font-medium text-white"
        >
          <Plus size={16} />
          Nova categoria
        </button>
      </div>

      {deleteError && <p className="mt-4 text-sm text-[#e66767]">{deleteError}</p>}

      <div className="mt-6 rounded-lg border border-white/10 bg-[#141414] p-5">
        {status === 'loading' && categories.length === 0 ? (
          <p className="text-sm text-[#898781]">Carregando...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-[#898781]">Nenhuma categoria cadastrada ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between rounded-md bg-white/5 px-4 py-3"
              >
                <span className="text-sm text-white">{category.name}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditForm(category)}
                    className="rounded-md p-1.5 text-[#898781] hover:bg-white/5 hover:text-white"
                    aria-label="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    className="rounded-md p-1.5 text-[#898781] hover:bg-white/5 hover:text-[#e66767]"
                    aria-label="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isFormOpen && (
        <CategoryForm
          initial={editingCategory}
          onClose={() => setIsFormOpen(false)}
          onSubmit={async (name) => {
            if (editingCategory) {
              await dispatch(updateCategoryThunk({ id: editingCategory.id, data: { name } })).unwrap()
            } else {
              await dispatch(createCategoryThunk({ name })).unwrap()
            }
          }}
        />
      )}
    </div>
  )
}
