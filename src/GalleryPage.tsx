// src/GalleryPage.jsx
import axios from 'axios'
import React, { useEffect, useRef, useState, useMemo } from 'react' // 👈 useMemo

const PHOTOS_PER_PAGE = 8

const CITY_TABS = [
  'Todos',
  'Asistentes médicos',
  'Bucaramanga',
  'Santa Marta',
  'Villavicencio',
  'Cartagena',
  'Medellin',
  'Bogota',
  'Barranquilla',
  'Manizales',
  'Valledupar',
  'Armenia',
  'Cali',
  'Cúcuta',
  'Ibagué',
  'Neiva',
  'Pereira',
]

export default function GalleryPage() {
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(() => new Set())
  const [pagePhotos, setPagePhotos] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [cityFilter, setCityFilter] = useState<string>('Todos')

  // 🔹 Modal global para imagen/video
  const [modalMedia, setModalMedia] = useState<{
    src: string
    type: 'image' | 'video'
  } | null>(null)

  // 🔹 ref para el contenedor de tabs de ciudades
  const tabsRef = useRef<HTMLDivElement | null>(null)

  // 🔹 Descargar (botón normal en tarjeta)
  const downloadImage = async (src: string) => {
    try {
      const original = new URL(src)
      const relativePath = original.pathname.replace(/^\//, '')
      const downloadUrl = `https://medplus-survey-results-api.eml.com.co/api/download-media?path=${encodeURIComponent(
        relativePath
      )}`

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = ''
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading:', error)
    }
  }

  const toggleSelected = (id: any) => {
    setSelected((prev) => {
      const copy = new Set(prev)
      if (copy.has(id)) copy.delete(id)
      else copy.add(id)
      return copy
    })
  }

  const goToPage = (newPage: any) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCityChange = (city: string) => {
    setCityFilter(city)
    setPage(1)
  }

  const getGallery = async () => {
    try {
      const res = await axios.get(
        `https://medplus-survey-results-api.eml.com.co/api/files?page=${page}&per_page=${PHOTOS_PER_PAGE}${
          cityFilter !== 'Todos' ? `&search=${cityFilter}` : ''
        }`
      )

      const normalized = res.data.data.map((item: any) => ({
        ...item,
        src: item.file_url,
        type: item.file_type,
      }))

      setTotalPages(Math.ceil(res.data.total / 8))
      setPagePhotos(normalized)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getGallery()
  }, [page, cityFilter])

  // 🔹 Lógica para paginación con "..."
  const paginationItems = useMemo<(number | string)[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const items: (number | string)[] = []

    if (page <= 4) {
      items.push(1, 2, 3, 4, 5, '...', totalPages)
    } else if (page >= totalPages - 3) {
      items.push(
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      )
    } else {
      items.push(1, '...', page - 1, page, page + 1, '...', totalPages)
    }

    return items
  }, [page, totalPages])

  return (
    <div className="nc-bg">
      {/* ============================================================
           🔥 MODAL GLOBAL (Imagen / Video) — SIN BOTÓN DESCARGAR
      ============================================================== */}
      {modalMedia && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={() => setModalMedia(null)}
        >
          <div
            className="relative max-w-4xl w-[90%] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {modalMedia.type === 'video' ? (
              <video
                src={modalMedia.src}
                controls
                autoPlay
                className="w-full max-h-[75vh] object-contain rounded-lg shadow-xl bg-black"
              />
            ) : (
              <img
                src={modalMedia.src}
                alt="Vista ampliada"
                className="w-full max-h-[75vh] object-contain rounded-lg shadow-xl"
              />
            )}

            {/* ❌ Botón cerrar */}
            <button
              className="
                absolute top-3 right-3 px-3 py-1 rounded-md 
                bg-white/90 text-black font-semibold text-sm
                shadow hover:bg-white
              "
              onClick={() => setModalMedia(null)}
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Fondo */}
      <div className="nc-plane nc-plane-bottom" />
      <div className="nc-plane nc-plane-top" />
      <div className="nc-middle" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="w-full bg-black">
          <div className="max-w-6xl mx-auto h-24 px-6 flex items-center justify-between">
            <img
              src="/images/logoem.png"
              alt="TNC Encuesta"
              className="h-14 w-auto object-contain cursor-pointer"
              onClick={() => (window.location.href = '/')}
            />

            <button
              onClick={() => (window.location.href = '/')}
              className="
                font-semibold text-sm px-4 py-2 rounded-md
                transition-all duration-300 ease-out
                hover:scale-105 hover:shadow-[0_0_10px_rgba(247,208,138,0.55)]
                active:scale-95 flex items-center gap-1
              "
              style={{
                background:
                  'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
                color: '#000',
                border: '1px solid #b8860b',
              }}
            >
              ⬅ Regresar
            </button>
          </div>

          <div
            className="w-full h-[10px]"
            style={{
              background:
                'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
            }}
          />
        </header>

        {/* MAIN */}
        <main className="flex-1">
          <div className="max-w-6xl mx-auto my-10 bg-white rounded-md shadow-sm border border-slate-200">
            {/* FILTROS */}
            <div className="border-b border-slate-200 px-6 pt-6 pb-3 relative">
              {/* 🔹 Flecha izquierda */}
              <button
                type="button"
                className="
                  hidden sm:flex
                  items-center justify-center
                  absolute left-4 top-[2.65rem]
                  -translate-y-1/2
                  w-8 h-8 rounded-full
                  text-[#b8860b]
                  bg-white/95
                  border border-[#f7d08a]
                  shadow-sm
                  transition-all duration-200
                  hover:text-black
                  hover:shadow-[0_0_10px_rgba(247,208,138,0.6)]
                  hover:bg-gradient-to-r hover:from-[#b8860b] hover:to-[#f7d08a]
                  z-20
                "
                onClick={() => {
                  if (tabsRef.current) {
                    tabsRef.current.scrollBy({
                      left: -200,
                      behavior: 'smooth',
                    })
                  }
                }}
              >
                ◀
              </button>

              {/* Contenedor scrollable de tabs */}
              <div
                ref={tabsRef}
                className="
                  flex items-center gap-4 
                  overflow-x-auto 
                  scroll-smooth
                  px-10
                  pt-1
                  pb-4
                "
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <style>
                  {`
                    div[role="tablist"]::-webkit-scrollbar {
                      display: none;
                    }
                  `}
                </style>

                <div
                  role="tablist"
                  className="flex items-center gap-4"
                  style={{ minWidth: '100%' }}
                >
                  {CITY_TABS.map((city) => {
                    const isActive = cityFilter === city

                    const baseClasses =
                      'relative px-4 py-1 text-sm font-semibold tracking-wide rounded-full border transition-all duration-200 whitespace-nowrap'

                    const extraClasses = isActive
                      ? 'bg-white text-black border-[#b8860b] shadow-[0_4px_12px_rgba(0,0,0,0.04)]'
                      : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50 hover:text-black'

                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCityChange(city)}
                        className={baseClasses + ' ' + extraClasses}
                      >
                        <span>{city}</span>

                        {isActive && (
                          <span
                            className="absolute left-1/2 -bottom-1 h-[2px] w-8 -translate-x-1/2 rounded-full"
                            style={{
                              background:
                                'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
                            }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 🔹 Flecha derecha */}
              <button
                type="button"
                className="
                  hidden sm:flex
                  items-center justify-center
                  absolute right-4 top-[2.65rem]
                  -translate-y-1/2
                  w-8 h-8 rounded-full
                  text-[#b8860b]
                  bg-white/95
                  border border-[#f7d08a]
                  shadow-sm
                  transition-all duration-200
                  hover:text-black
                  hover:shadow-[0_0_10px_rgba(247,208,138,0.6)]
                  hover:bg-gradient-to-r hover:from-[#b8860b] hover:to-[#f7d08a]
                  z-20
                "
                onClick={() => {
                  if (tabsRef.current) {
                    tabsRef.current.scrollBy({
                      left: 200,
                      behavior: 'smooth',
                    })
                  }
                }}
              >
                ▶
              </button>
            </div>

            {/* GRID DE MEDIA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {pagePhotos.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-md shadow-sm border border-slate-200 overflow-visible flex flex-col"
                >
                  {/* MEDIA */}
                  <div
                    className="relative group cursor-pointer overflow-visible"
                    onClick={() =>
                      setModalMedia({
                        src: item.src,
                        type: item.type === 'video' ? 'video' : 'image',
                      })
                    }
                  >
                    <div className="pt-[135%] bg-slate-200 relative overflow-visible">
                      {item.type === 'video' ? (
                        <>
                          {/* VIDEO en tarjeta (sin controls) */}
                          <video
                            src={item.src}
                            poster={item.poster}
                            className="absolute inset-0 w-full h-full object-cover"
                            muted
                            playsInline
                          />

                          {/* Overlay con ícono de Play */}
                          <div
                            className="
                              absolute inset-0 
                              flex items-center justify-center
                              bg-black/25
                              z-20
                            "
                          >
                            <div
                              className="
                                w-14 h-14 
                                bg-white/90 
                                rounded-full 
                                flex items-center justify-center 
                                shadow-lg
                              "
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-7 h-7 text-black"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M6.5 5.5v9l8-4.5-8-4.5z" />
                              </svg>
                            </div>
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.src}
                          alt={`Foto ${item.id}`}
                          className="absolute inset-0 w-full h-full object-cover 
                            transition-transform duration-300 ease-out
                            group-hover:scale-[1.12]
                            group-hover:-translate-y-1
                            group-hover:z-20
                          "
                        />
                      )}
                    </div>

                    {/* VIDEO LABEL */}
                    {item.type === 'video' && (
                      <span className="absolute top-2 left-2 bg-black/70 text-[10px] font-semibold text-white px-2 py-1 rounded z-30">
                        VIDEO
                      </span>
                    )}
                  </div>

                  {/* BOTÓN DESCARGAR */}
                  <button
                    type="button"
                    className="
                      mt-auto flex items-center justify-center gap-2 
                      text-[11px] font-semibold tracking-wide uppercase py-2
                      rounded-md
                      transition-all duration-300 ease-out
                      hover:scale-105 hover:shadow-[0_0_10px_rgba(247,208,138,0.6)]
                      active:scale-95
                    "
                    style={{
                      background:
                        'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
                      color: '#000',
                      border: '1px solid #b8860b',
                    }}
                    onClick={() => downloadImage(item.src)}
                  >
                    ⬇ Descargar
                  </button>
                </div>
              ))}
            </div>

            {/* PAGINACIÓN */}
            <div className="border-t border-slate-200 px-4 py-5 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {/* Botón anterior */}
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className={`
                    h-8 px-3 rounded-full border text-xs font-medium
                    flex items-center justify-center
                    ${
                      page === 1
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }
                  `}
                >
                  ‹
                </button>

                {paginationItems.map((item, idx) =>
                  item === '...' ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-xs text-slate-400 select-none"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item as number}
                      type="button"
                      onClick={() => goToPage(item as number)}
                      className={`
                        min-w-[2.2rem] h-8 border text-xs rounded-full px-3 flex items-center justify-center transition-all duration-200
                        ${
                          page === item
                            ? 'text-black font-semibold hover:scale-105 hover:shadow-[0_0_10px_rgba(247,208,138,0.6)]'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }
                      `}
                      style={
                        page === item
                          ? {
                              background:
                                'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
                              borderColor: '#b8860b',
                            }
                          : {}
                      }
                    >
                      {item}
                    </button>
                  )
                )}

                {/* Botón siguiente */}
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className={`
                    h-8 px-3 rounded-full border text-xs font-medium
                    flex items-center justify-center
                    ${
                      page === totalPages
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }
                  `}
                >
                  ›
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                Página <span className="font-semibold">{page}</span> de{' '}
                <span className="font-semibold">{totalPages}</span>
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div
            className="w-full h-24 mt-10"
            style={{
              background:
                'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
            }}
          />
        </main>
      </div>
    </div>
  )
}
