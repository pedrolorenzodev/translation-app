console.log('VITE CONFIG LOADED')

export default {
	server: {
	  proxy: {
		'/api': 'http://localhost:3001'
	  }
	}
  }