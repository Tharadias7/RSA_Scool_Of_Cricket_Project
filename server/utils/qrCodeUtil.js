const QRCode = require('react-qr-code');

function qrCodeGenerate({ playerId }) {
      <QRCode value={playerId} />
}

export default qrCodeGenerate