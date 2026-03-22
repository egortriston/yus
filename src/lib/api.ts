export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`http://127.0.0.1:8765${path}`);
  if (!response.ok) {
    throw new Error(`GET ${path} failed`);
  }
  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`http://127.0.0.1:8765${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) {
    throw new Error(`POST ${path} failed`);
  }
  return response.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`http://127.0.0.1:8765${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`PUT ${path} failed`);
  }
  return response.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`http://127.0.0.1:8765${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`PATCH ${path} failed`);
  }
  return response.json() as Promise<T>;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(`http://127.0.0.1:8765${path}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error(`DELETE ${path} failed`);
  }
  return response.json() as Promise<T>;
}

export async function apiUpload<T>(path: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`http://127.0.0.1:8765${path}`, {
    method: "POST",
    body: formData
  });
  if (!response.ok) {
    throw new Error(`UPLOAD ${path} failed`);
  }
  return response.json() as Promise<T>;
}
