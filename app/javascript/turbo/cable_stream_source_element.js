import { connectStreamSource, disconnectStreamSource } from "@hotwired/turbo"
import { subscribeTo } from "./cable"

class TurboCableStreamSourceElement extends HTMLElement {
  async connectedCallback() {
    connectStreamSource(this)
    const ctx = this
    setTimeout(async function(){
      console.log('subsribeTo in connectedCallback')
      ctx.subscription = await subscribeTo(ctx.channel, { received: ctx.dispatchMessageEvent.bind(ctx) })
    }, 500);
  }

  disconnectedCallback() {
    disconnectStreamSource(this)
    if (this.subscription) this.subscription.unsubscribe()
  }

  dispatchMessageEvent(data) {
    const event = new MessageEvent("message", { data })
    return this.dispatchEvent(event)
  }

  get channel() {
    const channel = this.getAttribute("channel")
    const signed_stream_name = this.getAttribute("signed-stream-name")
    return { channel, signed_stream_name }
  }
}

customElements.define("turbo-cable-stream-source", TurboCableStreamSourceElement)
