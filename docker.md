docker run --name loki -d -v /projects/ms/loki:/mnt/config -p 3100:3100 grafana/loki:3.0.0 -config.file=/mnt/config/loki-config.yaml


docker run --name promtail -d -v /projects/ms/promtail:/mnt/config -v /projects/ms/logs:/var/log --link loki grafana/promtail:3.0.0 -config.file=/mnt/config/promtail-config.yaml

docker run -d \
  -p 3000:3000 \
  --name grafana \
  -v grafana-data:/var/lib/grafana \
  grafana/grafana:latest


docker run -d \
  --name=node_exporter \
  -p 9100:9100 \
  prom/node-exporter:latest


docker run -d \
  --name=prometheus \
  -p 9090:9090 \
  -v /projects/ms/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus:latest \
  --config.file=/etc/prometheus/prometheus.yml


