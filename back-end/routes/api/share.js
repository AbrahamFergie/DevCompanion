const express = require('express');
const router = express.Router();
const share = require('../../models')

router.post("/add", (request, response) => {
	const { username: user } = request.user
	
	if( user ) {
		const { type, payload } = request.body
		const { job, article, event} = share
		
		if( type === "article" ){
			const { title, author, url } = payload
			article.create({ user, title, author, url }, (err, newArticle) => {
				if(err) console.log('====err====', err)
				return response.json({ shared: true })
			})
		}
		if( type === "event" ){
			const { name, localized_location, link } = payload

			event.create({ user, name, localized_location, link }, (err, newEvent) => {
				if(err) console.log('====err====', err)
				return response.json({ shared: true })
			})
		}
		if( type === "job" ){
			const { title, location, url } = payload

			job.create({ user, title, location, url }, (err, newJob) => {
				if(err) console.log('====err====', err)
				return response.json({ shared: true })
			})
		}
	}
})

router.post("/check-shared", ( request, response ) => {
	const { type, payload } = request.body
	const { job, article, event} = share

	if( type === "article" ){

		article.find({ url: payload }, ( err, foundArticle ) => {
			if( err ) console.log( '====err====', err )
			if( foundArticle.length > 0 ) return response.json({ found: true })
			return response.json({ found: false })
		})
	}
	if( type === "event" ){

		event.find({ link: payload }, (err, foundEvent) => {
			if(err) console.log('====err====', err)
			if( foundEvent.length > 0 ) return response.json({ found: true })
			return response.json({ found: false })
		})
	}
	if( type === "job" ){

		job.find({ url: payload }, (err, foundJob) => {
			if(err) console.log('====err====', err)
			if( foundJob.length > 0 ) return response.json({ found: true })
			return response.json({ found: false })
		})
	}
})

router.get("/shared-items", ( request, response ) => {
	const { job, article, event } = share
	let payload = {}

	job.find({}, ( err, data ) => { 
		if( err ) response.json(err)
		payload.jobs = data 
		
		article.find({}, ( err, data ) => { 
			if( err ) response.json(err)
			payload.articles = data 
			
			event.find({}, ( err, data ) => { 
				if( err ) response.json(err)
				payload.events = data 
				response.json(payload)
			})
		})
	})
})
 
module.exports = router;