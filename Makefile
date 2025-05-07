start-frontend:
	cd frontend && npm run dev

start-backend:
	cd backend/scripts && ./start.sh

stop-frontend:
	kill -9 $$(pgrep -f "npm run dev")

stop-backend:
	@if pgrep -f "./start.sh" > /dev/null; then \
		kill -9 $$(pgrep -f "node ./dist/src/main.js")  \
		&& pkill -9 "stripe"  \
	else \
		echo "Backend process not running"; \
	fi

stop-all:
	stop-frontend & stop-backend
