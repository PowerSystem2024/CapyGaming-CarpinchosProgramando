#!/bin/bash

# ============================================
# Script para levantar CapyGaming en modo desarrollo
# ============================================

echo "Iniciando CapyGaming en modo desarrollo..."

# 1. Verificar si ngrok está corriendo
NGROK_RUNNING=$(pgrep ngrok)

if [ -z "$NGROK_RUNNING" ]; then
  echo "Levantando ngrok para webhooks de MercadoPago..."
  ngrok http 3001 > /dev/null 2>&1 &
  sleep 3
fi

# 2. Obtener URL de ngrok
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | \
  grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -1)

if [ -z "$NGROK_URL" ]; then
  echo "Error: No se pudo obtener la URL de ngrok"
  echo " Asegurate de tener ngrok instalado y corriendo"
  exit 1
fi

echo "URL de ngrok: $NGROK_URL"

# 3. Levantar contenedores con la URL de ngrok
echo "Levantando contenedores Docker..."
BACKEND_URL=$NGROK_URL docker-compose up -d

# 4. Esperar a que el backend esté listo
echo "Esperando a que el backend esté listo..."
sleep 5

# 5. Mostrar resumen
echo ""
echo "CapyGaming levantado exitosamente!"
echo ""
echo "URLs importantes:"
echo " Frontend: http://localhost:5173"
echo " Backend: http://localhost:3001"
echo " Webhook (ngrok): $NGROK_URL/api/webhooks/webhook"
echo ""
echo "IMPORTANTE: Configurá esta URL en el panel de MercadoPago:"
echo " https://www.mercadopago.com.ar/developers/panel/app"
echo " Webhooks -> URL: $NGROK_URL/api/webhooks/webhook"
echo ""
echo "Para ver logs del backend: docker logs capygaming-backend -f"
echo "Para detener: docker-compose down"
echo ""
