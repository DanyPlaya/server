const fs = require('fs');
const fastify = require('fastify')({ logger: true });

fastify.register(require('fastify-cors'), {});

fastify.get('/', async (request, reply) => {
	fs.readFile('./users.json', 'utf8', (err, data) => {
		if (err) {
			console.log('File read failed:', err);
			return;
		}

		if(request.query.term)
		{
			const result = JSON.parse(data).filter((elem)=> elem.name.toLowerCase().search(request.query.term.toLowerCase()) !== -1);
			reply.send(JSON.stringify(result));
		}
		else
		{
			reply.send(data);
		}

	})
});
fastify.get('/user/:id', async (request, reply) => {
	const userId = parseInt(request.params.id); // Get the user ID from the URL parameters
  
	fs.readFile('./users.json', 'utf8', (err, data) => {
	  if (err) {
		console.log('File read failed:', err);
		return;
	  }
  
	  const users = JSON.parse(data);
	  const user = users.find((user) => user.id === userId);
  
	  if (user) {
		reply.send(user);
	  } else {
		reply.code(404).send({ message: 'User not found' });
	  }
	});
  });
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
