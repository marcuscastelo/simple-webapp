export const mapActions = {
  openMapsPageWithSearch: (search: string) => {
    // Opens /map route with search query param
    const url = new URL(window.location.origin + '/map')
    if (search) {
      url.searchParams.set('search', search)
    }
    // TODO: use router navigation instead of full page reload
    window.location.href = url.toString()
  },
}
