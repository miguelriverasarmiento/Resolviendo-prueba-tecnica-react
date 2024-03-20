import { useEffect, useState, useRef, useMemo } from 'react'
import { SortBy, type User } from './types.d'
import './App.css'
import { UsersList } from './components/UsersList'

function App() {

  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const originalUsers = useRef<User[]>([])

  const toogleColors = () => {
    setShowColors(!showColors)
  }

  const toogleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter(user => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
        originalUsers.current = res.results
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const filteredUsers = useMemo(() => {
    console.log('ad')
    return filterCountry !== null && filterCountry.length > 0
    ? users.filter(user => user.location.country.toLowerCase().includes(filterCountry.toLowerCase()))
    : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    console.log('calculate sortedUsers')

    if (sorting === SortBy.NONE) return filteredUsers

    if (sorting === SortBy.COUNTRY) {
      return filteredUsers.toSorted(
        (a, b) => a.location.country.localeCompare(b.location.country)
      )
    }
    if (sorting === SortBy.NAME) {
      return filteredUsers.toSorted(
        (a, b) => a.name.first.localeCompare(b.name.first)
      )
    }
    if (sorting === SortBy.LAST) {
      return filteredUsers.toSorted(
        (a, b) => a.name.last.localeCompare(b.name.last)
      )
    }
  }, [filteredUsers, sorting])
  
  return (
      <div className='App'>
        <h1>Prueba tecnica</h1>
        <header>
          <button onClick={toogleColors}>
            Colorear filas
          </button>
          <button onClick={toogleSortByCountry}>
            {sorting === SortBy.COUNTRY ? 'No ordenar por pais' : 'Ordenar por pais'}
          </button>
          <button onClick={handleReset}>
            Resetear estado
          </button>
          <input placeholder='Filtra por pais' onChange={(e) => setFilterCountry(e.target.value)}/>
        </header>
        <main>
          <UsersList changeSorting={handleChangeSort} deleteUser={handleDelete} showColors={showColors} users={sortedUsers}/>
        </main>
      </div>
  )
}

export default App
