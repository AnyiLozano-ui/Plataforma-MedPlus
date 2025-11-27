// src/GalleryPage.jsx
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const PHOTOS_PER_PAGE = 8

export default function GalleryPage() {
	const [page, setPage] = useState(1)
	const [selected, setSelected] = useState(() => new Set())
	const [pagePhotos, setPagePhotos] = useState([])
	const [totalPages, setTotalPages] = useState(1)

	const startIndex = (page - 1) * PHOTOS_PER_PAGE

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

	const getGallery = async () => {
		try {
			const res = await axios.get(
				`https://medplus-survey-results-api.eml.com.co/api/files?page=${page}&per_page=8`
			)
			setTotalPages(Math.ceil(res.data.total / 8))
			setPagePhotos(
				res.data.data.map((item: any) => ({
					...item,
					src: item.file_url,
					type: item.file_type,
				}))
			)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		getGallery()
	}, [page])

	return (
		<div className="nc-bg">
			{/* Fondo de bolitas */}
			<div className="nc-plane nc-plane-bottom" />
			<div className="nc-plane nc-plane-top" />
			<div className="nc-middle" />

			<div className="relative z-10 min-h-screen flex flex-col">
				{/* HEADER NEGRO + FRANJA AMARILLA */}
				<header className="w-full bg-black">
					<div className="max-w-6xl mx-auto h-24 px-6 flex items-center justify-between">
						{/* Logo */}
						<img
							src="/images/logoem.png"
							alt="TNC Encuesta"
							className="h-14 w-auto object-contain cursor-pointer"
							onClick={() => (window.location.href = '/')}
						/>

						{/* Botón regresar */}
						<button
							onClick={() => (window.location.href = '/')}
							className="text-[#ffd438] font-semibold text-sm bg-transparent border border-[#ffd438] px-4 py-2 rounded-md 
                 hover:bg-[#ffd438] hover:text-black transition-all duration-300">
							⬅ Regresar
						</button>
					</div>

					<div className="w-full h-[10px] bg-[#ffd438]" />
				</header>

				{/* CONTENIDO PRINCIPAL */}
				<main className="flex-1">
					<div className="max-w-6xl mx-auto my-10 bg-white rounded-md shadow-sm border border-slate-200">
						{/* GRID DE FOTOS / VIDEO */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
							{pagePhotos.map((item: any) => (
								<div
									key={item.id}
									className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden flex flex-col">
									{/* MEDIA */}
									<div className="relative group cursor-pointer">
										<div className="pt-[135%] bg-slate-200">
											{item.type === 'video' ? (
												<video
													src={item.src}
													poster={item.poster}
													controls
													className="absolute inset-0 w-full h-full object-cover"
												/>
											) : (
												<img
													src={item.src}
													alt={`Foto ${item.id}`}
													className="
                            absolute inset-0 w-full h-full object-cover
                            transition-all duration-500 ease-out 
                            group-hover:scale-107 group-hover:-rotate-1 group-hover:brightness-90
                          "
												/>
											)}
										</div>

										{/* Etiqueta VIDEO en la esquina para diferenciarla */}
										{item.type === 'video' && (
											<span className="absolute top-2 left-2 bg-black/70 text-[10px] font-semibold text-white px-2 py-1 rounded">
												VIDEO
											</span>
										)}

										{/* CHECK DE SELECCIÓN */}
										<button
											type="button"
											onClick={() =>
												toggleSelected(item.id)
											}
											className={`absolute top-2 right-2 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold
                        ${
							selected.has(item.id)
								? 'bg-[#1f3c63] border-[#1f3c63] text-white'
								: 'bg-white/95 border-slate-300 text-slate-500'
						}`}>
											✓
										</button>
									</div>

									{/* BOTÓN DOWNLOAD (Descarga imagen o video en otra pestaña) */}
									<button
										type="button"
										className="mt-auto flex items-center justify-center gap-2 bg-[#102845] text-[11px] font-semibold tracking-wide text-white uppercase py-2 hover:bg-[#1a3557] transition"
										onClick={async () => {
											console.log(item.src.split('/'))
											const original = new URL(item.src)
											const relativePath =
												original.pathname.replace(
													/^\//,
													''
												)
											const downloadUrl = `https://medplus-survey-results-api.eml.com.co/api/download-media?path=${encodeURIComponent(
												relativePath
											)}`

											const link =
												document.createElement('a')
											link.href = downloadUrl
											link.download = '' // el nombre lo fuerza el backend con Content-Disposition
											document.body.appendChild(link)
											link.click()
											document.body.removeChild(link)
										}}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-4 h-4"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path d="M9 2a1 1 0 012 0v8.586l2.293-2.293a1 1 0 111.414 1.414l-4.0 4a1 1 0 01-1.414 0l-4.0-4A1 1 0 115.707 8.293L8 10.586V2z" />
											<path d="M4 14a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" />
										</svg>
										DOWNLOAD
									</button>
								</div>
							))}
						</div>

						{/* PAGINACIÓN */}
						<div className="border-t border-slate-200 px-4 py-4 flex flex-col items-center gap-3">
							<div className="flex items-center gap-1">
								{Array.from(
									{ length: totalPages },
									(_, i) => i + 1
								).map((n) => (
									<button
										key={n}
										type="button"
										onClick={() => goToPage(n)}
										className={`min-w-[2.2rem] h-8 border text-sm rounded-sm px-2
                      ${
							page === n
								? 'bg-[#1f3c63] text-white border-[#1f3c63]'
								: 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
						}`}>
										{n}
									</button>
								))}

								{totalPages > 10 && (
									<span className="px-2 text-xs text-slate-500">
										…
									</span>
								)}

								{totalPages > 1 && (
									<button
										type="button"
										onClick={() => goToPage(page + 1)}
										disabled={page === totalPages}
										className={`min-w-[2.2rem] h-8 border text-sm rounded-sm px-2 flex items-center justify-center
                    ${
						page === totalPages
							? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
							: 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
					}`}>
										&gt;
									</button>
								)}
							</div>

							<p className="text-[11px] text-slate-500">
								Página{' '}
								<span className="font-semibold">{page}</span> de{' '}
								<span className="font-semibold">
									{totalPages}
								</span>
							</p>
						</div>
					</div>

					{/* FOOTER AMARILLO */}
					<div className="w-full bg-[#ffd438] h-24 mt-10" />
				</main>
			</div>
		</div>
	)
}
