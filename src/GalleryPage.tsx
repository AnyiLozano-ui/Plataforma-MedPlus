// src/GalleryPage.jsx
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const PHOTOS_PER_PAGE = 8

const CITY_TABS = [
	'Todos',
	'Bucaramanga',
	'Santa Marta',
	'Villavicencio',
	'Cartagena',
	'Medellin',
]

export default function GalleryPage() {
	const [page, setPage] = useState(1)
	const [selected, setSelected] = useState(() => new Set())
	const [pagePhotos, setPagePhotos] = useState<any[]>([])
	const [totalPages, setTotalPages] = useState(1)
	const [cityFilter, setCityFilter] = useState<string>('Todos')

	const [openImage, setOpenImage] = useState<string | null>(null)

	// ---------------------------------------
	// 🔽 FUNCIÓN DE DESCARGA PARA EL MODAL
	// ---------------------------------------
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

	return (
		<div className="nc-bg">

			{/* ======================================================
			     🔥 MODAL DE IMAGEN + BOTÓN DOWNLOAD
			====================================================== */}
			{openImage && (
				<div
					className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]"
					onClick={() => setOpenImage(null)}
				>
					<div
						className="relative max-w-3xl max-h-[90vh] flex flex-col items-center"
						onClick={(e) => e.stopPropagation()}
					>
						<img
							src={openImage}
							alt="Imagen ampliada"
							className="rounded-lg max-h-[80vh] object-contain shadow-lg"
						/>

						{/* Botón cerrar */}
						<button
							className="
								absolute top-2 right-2 px-3 py-1 rounded-md 
								bg-white/90 text-black font-semibold 
								shadow hover:bg-white
							"
							onClick={() => setOpenImage(null)}
						>
							X
						</button>

						{/* BOTÓN DOWNLOAD DORADO */}
						<button
							type="button"
							onClick={() => downloadImage(openImage)}
							className="
								mt-4 w-full flex items-center justify-center gap-2 
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
						>
							⬇ Descargar
						</button>
					</div>
				</div>
			)}

			{/* Fondo */}
			<div className="nc-plane nc-plane-bottom" />
			<div className="nc-plane nc-plane-top" />
			<div className="nc-middle" />

			<div className="relative z-10 min-h-screen flex flex-col">
				{/* HEADER NEGRO */}
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
						<div className="border-b border-slate-200 px-6 pt-6 pb-3 flex flex-wrap items-center gap-6">
							{CITY_TABS.map((city) => (
								<button
									key={city}
									type="button"
									onClick={() => handleCityChange(city)}
									className={`
										pb-2 text-sm font-semibold tracking-wide
										border-b-2 transition-all duration-200
										${
											cityFilter === city
												? 'border-[#b8860b] text-black'
												: 'border-transparent text-slate-500 hover:text-black hover:border-slate-400'
										}
									`}
								>
									{city}
								</button>
							))}
						</div>

						{/* GRID DE FOTOS */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
							{pagePhotos.map((item: any) => (
								<div
									key={item.id}
									className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden flex flex-col"
								>
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

										{/* ETIQUETA VIDEO */}
										{item.type === 'video' && (
											<span className="absolute top-2 left-2 bg-black/70 text-[10px] font-semibold text-white px-2 py-1 rounded">
												VIDEO
											</span>
										)}

										{/* CHECK */}
										<button
											type="button"
											onClick={() => toggleSelected(item.id)}
											className={`absolute top-2 right-2 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold
												${
													selected.has(item.id)
														? 'bg-[#1f3c63] border-[#1f3c63] text-white'
														: 'bg-white/95 border-slate-300 text-slate-500'
												}
											`}
										>
											✓
										</button>
									</div>

									{/* BOTÓN VER IMAGEN */}
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
										onClick={() => setOpenImage(item.src)}
									>
										Ver Imagen
									</button>  
								</div>
							))}
						</div>

						{/* PAGINACIÓN */}
						<div className="border-t border-slate-200 px-4 py-4 flex flex-col items-center gap-3">
							<div className="flex items-center gap-1">
								{Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
									<button
										key={n}
										type="button"
										onClick={() => goToPage(n)}
										className={`
											min-w-[2.2rem] h-8 border text-sm rounded-sm px-2 flex items-center justify-center transition-all duration-200
											${
												page === n
													? 'text-black font-semibold hover:scale-105 hover:shadow-[0_0_10px_rgba(247,208,138,0.6)]'
													: 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
											}
										`}
										style={
											page === n
												? {
														background:
															'linear-gradient(90deg, #b8860b 0%, #f7d08a 50%, #b8860b 100%)',
														borderColor: '#b8860b',
												  }
												: {}
										}
									>
										{n}
									</button>
								))}
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
