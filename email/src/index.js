/**
 * hello@gardeninsound.org → every address in env.TO.
 * If any forward fails the message is rejected, so the sender gets a bounce instead of mail
 * vanishing silently.
 */
export default {
  async email(message, env) {
    const to = env.TO.split(',').map((s) => s.trim()).filter(Boolean);
    await Promise.all(to.map((addr) => message.forward(addr)));
  },
};
