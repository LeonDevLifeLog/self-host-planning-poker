FROM --platform=$BUILDPLATFORM docker.xuanyuan.me/library/node:lts-slim AS node_builder
WORKDIR /angular
COPY angular/ /angular
RUN npm config set update-notifier false && \
  npm config set registry https://registry.npmmirror.com && \
  npm config set fund false && \
  npm config set audit false && \
  npm ci
RUN npm run build self-host-planning-poker

FROM docker.xuanyuan.me/library/python:3.11.7-alpine3.18
WORKDIR /app
COPY flask/ ./
COPY --from=node_builder /angular/dist/self-host-planning-poker ./static
RUN pip install --upgrade -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple  pip && \
  pip install -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple --requirement requirements.txt && \
  mkdir /data
CMD [ "gunicorn", "--worker-class", "eventlet", "-w", "1", "app:app", "--bind", "0.0.0.0:8000" ]
