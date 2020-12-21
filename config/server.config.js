let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}

module.exports = {
  'api_port': +port,
};
