import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/posts';

export default function PostList() {

  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    author: '',
    value: '',
    image: null,
    file: null
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchPosts = async () => {
    const response = await axios.get(API_URL);
    setPosts(response.data);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();
      for (const key in form) {
        if (form[key]) formData.append(key, form[key]);
      }

      if (editingId) {
    
        await axios.post(`${API_URL}/${editingId}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setMessage('Post mis à jour avec succès !');

        setEditingId(null);
        
      } else {

        await axios.post(API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Post ajouté avec succès !');
      }
      setForm({ title: '', content: '', author: '', value: '', image: null, file: null });
      fetchPosts();
    } catch (error) {
      setMessage("Une erreur s'est produite.");
    }
  };

  const handleDelete = async (id) => {

    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage('Post supprimé avec succès !');
      fetchPosts();
    } catch (error) {
      setMessage("Erreur lors de la suppression.");
    }

  };

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      content: post.content,
      author: post.author,
      value: post.value,
      image: null,
      file: null
    });
    setEditingId(post.id);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* <h1 className="text-3xl font-bold mb-4 text-center">PostList (Frontend React)</h1> */}
      <h2 className="text-xl mb-6 text-center">Post List (React + Laravel API)</h2>

      {message && (
        <div className="mb-4 text-center text-green-500 font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-start" encType="multipart/form-data">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="border p-2 rounded h-20 sm:col-span-2"
          required
        ></textarea>
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          name="value"
          placeholder="Value"
          value={form.value}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="sm:col-span-2 border p-2 rounded"
        />
        <input
          type="file"
          name="file"
          onChange={handleChange}
          className="sm:col-span-2 border p-2 rounded"
        />
        <button
          type="submit"
          className="sm:col-span-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {editingId ? 'Mettre à jour' : 'Ajouter un Post'}
        </button>
      </form>

      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border p-4 rounded shadow-md">
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-sm text-gray-500">Auteur : {post.author} | Note : {post.value}</p>
            {post.image && (
              <img
                src={`http://127.0.0.1:8000/storage/${post.image}`}
                alt="post"
                className="my-2 rounded img-thumbnail object-cover border"
              />
            )}
            {post.file && (
              <a
                href={`http://127.0.0.1:8000/storage/${post.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Télécharger le fichier
              </a>
            )}
            <div className="mt-2 flex gap-2">
              <button
                className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                onClick={() => handleEdit(post)}
              >
                Éditer
              </button>
              <button
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                onClick={() => handleDelete(post.id)}
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}