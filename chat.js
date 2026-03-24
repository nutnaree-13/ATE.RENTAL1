document.addEventListener('DOMContentLoaded', () => {
  // Inject CSS for chat widget
  const style = document.createElement('style');
  style.textContent = `
    .chat-widget {
      position: fixed; bottom: 90px; right: 20px;
      width: 350px; max-width: calc(100vw - 40px);
      height: 500px; max-height: calc(100vh - 120px);
      background: #849ebf; border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      display: flex; flex-direction: column; overflow: hidden;
      z-index: 9999; opacity: 0; pointer-events: none;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: inherit;
    }
    .chat-widget.active { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }
    .chat-header {
      background: #06C755; color: white; padding: 12px 16px;
      display: flex; align-items: center; justify-content: space-between; z-index: 2;
    }
    .chat-header-info { display: flex; align-items: center; gap: 12px; }
    .chat-avatar {
      width: 36px; height: 36px; border-radius: 50%; background: #fff;
      display: flex; align-items: center; justify-content: center;
      color: #06C755; font-weight: bold; font-size: 14px;
    }
    .chat-title-box { display: flex; flex-direction: column; }
    .chat-title { font-weight: 600; font-size: 1rem; line-height: 1.2; }
    .chat-status { font-size: 0.75rem; opacity: 0.9; }
    .chat-close { background: none; border: none; color: white; font-size: 24px; cursor: pointer; line-height: 1; padding: 0 4px; }
    .chat-body {
      flex: 1; padding: 16px; overflow-y: auto;
      display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth;
    }
    .chat-date { text-align: center; margin: 8px 0; }
    .chat-date span { background: rgba(0,0,0,0.15); color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; }
    .chat-msg-wrap { display: flex; align-items: flex-end; gap: 8px; max-width: 85%; width: 100%; }
    .chat-msg-wrap.received { align-self: flex-start; }
    .chat-msg-wrap.sent { align-self: flex-end; flex-direction: row-reverse; }
    .chat-bubble {
      padding: 10px 14px; border-radius: 16px;
      font-size: 0.9rem; line-height: 1.4; position: relative; word-break: break-word;
    }
    .chat-bubble.image-bubble { padding: 4px; background: transparent !important; }
    .chat-bubble img { max-width: 200px; max-height: 250px; border-radius: 12px; display: block; object-fit: cover; }
    .chat-msg-wrap.received .chat-bubble:not(.image-bubble) { background: white; color: #333; border-bottom-left-radius: 4px; }
    .chat-msg-wrap.sent .chat-bubble:not(.image-bubble) { background: #06C755; color: white; border-bottom-right-radius: 4px; }
    .chat-time { font-size: 0.65rem; color: rgba(255,255,255,0.7); margin-bottom: 2px; white-space: nowrap; flex-shrink: 0; }
    .chat-msg-wrap.received .chat-time { color: rgba(0,0,0,0.4); }
    
    .chat-input-area {
      background: #fff; padding: 10px 12px;
      display: flex; gap: 8px; align-items: center; border-top: 1px solid #eee;
    }
    .chat-attach-btn {
      background: none; border: none; cursor: pointer; padding: 8px;
      display: flex; align-items: center; justify-content: center;
      color: #777; transition: color 0.2s;
    }
    .chat-attach-btn:hover { color: #06C755; }
    .chat-input {
      flex: 1; border: none; background: #f2f2f2;
      padding: 10px 16px; border-radius: 20px; outline: none;
      font-size: 0.9rem; font-family: inherit;
    }
    .chat-input:focus { background: #e8e8e8; }
    .chat-send {
      background: none; border: none; color: #06C755;
      font-weight: 600; cursor: pointer; padding: 8px; font-size: 0.9rem; transition: transform 0.2s;
    }
    .chat-send:active { transform: scale(0.95); }
    .chat-send:disabled { color: #ccc; cursor: not-allowed; }
  `;
  document.head.appendChild(style);

  // Inject Chat Widget HTML
  const chatHTML = `
    <div class="chat-widget" id="chatWidget">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">AR</div>
          <div class="chat-title-box">
            <span class="chat-title">ATE.Rental</span>
            <span class="chat-status">ตอบกลับทันที</span>
          </div>
        </div>
        <button class="chat-close" id="chatClose">&times;</button>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="chat-date"><span>วันนี้</span></div>
        <div class="chat-msg-wrap received">
          <div class="chat-avatar" style="width:28px;height:28px;font-size:10px;flex-shrink:0;">AR</div>
          <div class="chat-bubble">สวัสดีค่ะ 🙏 ATE.Rental ยินดีให้บริการ หากต้องการประเมินราคาฝากชุดเช่า สามารถแนบรูปชุดเต็มตัว ป้ายแบรนด์ และแจ้งตำหนิส่งมาประเมินได้เลยนะคะ 💖</div>
          <span class="chat-time">10:00</span>
        </div>
      </div>
      <div class="chat-input-area">
        <input type="file" id="chatFile" accept="image/*" style="display:none">
        <button class="chat-attach-btn" id="chatAttachBtn" aria-label="Attach File">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
        </button>
        <input type="text" class="chat-input" id="chatInput" placeholder="พิมพ์ข้อความ...">
        <button class="chat-send" id="chatSend" disabled>ส่ง</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', chatHTML);

  const floatingBtns = document.querySelectorAll('.floating-line');
  const chatWidget = document.getElementById('chatWidget');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatBody = document.getElementById('chatBody');
  const chatAttachBtn = document.getElementById('chatAttachBtn');
  const chatFile = document.getElementById('chatFile');

  // Change floating buttons behavior
  floatingBtns.forEach(btn => {
    btn.removeAttribute('href');
    btn.removeAttribute('target');
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      chatWidget.classList.add('active');
      setTimeout(() => chatInput.focus(), 300);
    });
  });

  chatClose.addEventListener('click', () => chatWidget.classList.remove('active'));

  chatInput.addEventListener('input', () => {
    chatSend.disabled = chatInput.value.trim().length === 0;
  });

  const getCurrentTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const addMessage = (content, type, isImage = false) => {
    const wrap = document.createElement('div');
    wrap.className = `chat-msg-wrap ${type}`;
    
    let bubbleClass = `chat-bubble ${isImage ? 'image-bubble' : ''}`;
    let innerContent = isImage ? `<img src="${content}" alt="Attachment">` : content;

    let html = '';
    if (type === 'received') {
      html += `<div class="chat-avatar" style="width:28px;height:28px;font-size:10px;flex-shrink:0;">AR</div>`;
      html += `<div class="${bubbleClass}">${innerContent}</div><span class="chat-time">${getCurrentTime()}</span>`;
    } else {
      html += `<span class="chat-time">${getCurrentTime()}</span><div class="${bubbleClass}">${innerContent}</div>`;
    }
    
    wrap.innerHTML = html;
    chatBody.appendChild(wrap);
    setTimeout(() => chatBody.scrollTop = chatBody.scrollHeight, 50);
  };

  const simulateReply = (isImageRequest = false) => {
    setTimeout(() => {
      if(isImageRequest) {
        addMessage("แอดมินได้รับรูปแล้วค่ะ แบรนด์เก๋มาก! ขออนุญาตส่งให้ทีมประเมินราคาสักครู่นะคะ 👗✨", 'received');
        setTimeout(() => {
             addMessage("สำหรับการฝากปล่อยเช่าชุดนี้ ราคาเช่าที่เหมาะสมคือ 490 บาท/3 วันค่ะ ลูกค้าตกลงปล่อยเช่าด้วยราคานี้มั้ยคะ?", 'received');
        }, 3000);
      } else {
        const replies = [
          "แอดมินกำลังเช็กคิวว่างให้นะคะ รอสักครู่ค่า 💕",
          "รับทราบค่ะ! แอดมินจดโน้ตไว้ให้แล้วนะคะ 😊",
          "มีอะไรสอบถามเรื่องฝากชุด ส่งรูปมาประเมินให้ก่อนได้เลยค่า"
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        addMessage(reply, 'received');
      }
    }, 1500);
  };

  const handleSend = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage(text, 'sent');
    chatInput.value = '';
    chatSend.disabled = true;
    simulateReply(false);
  };

  chatSend.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !chatSend.disabled) handleSend();
  });

  // Handle Attachment
  chatAttachBtn.addEventListener('click', () => {
    chatFile.click();
  });

  chatFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        addMessage(ev.target.result, 'sent', true);
        chatFile.value = ''; // reset
        simulateReply(true);
      };
      reader.readAsDataURL(file);
    }
  });
});
