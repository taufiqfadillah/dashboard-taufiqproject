async function deleteBlog(blogId) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`/delete-blog/${blogId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Swal.fire('Deleted!', 'Your blog has been deleted.', 'success');

        const blogsResponse = await fetch('/get-blogs');
        const updatedBlogs = await blogsResponse.json();
        updateBlogList(updatedBlogs);
      } else {
        const errorData = await response.json();
        Swal.fire('Error', errorData.error, 'error');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      Swal.fire('Error', 'An error occurred while deleting the blog.', 'error');
    }
  }
}

function updateBlogList(blogs) {
  const tbody = document.querySelector('.table tbody');
  tbody.innerHTML = '';

  blogs.forEach((blog, index) => {
    const newRow = `
        <tr>
          <th scope="row">${index + 1}</th>
          <td>${blog.author}</td>
          <td>${blog.title}</td>
          <td>${blog.content.substr(0, 50)}...</td>
          <td>${blog.category.join(', ')}</td>
          <td>${new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
          <td>
            <div class="icon-group">
              <a href="/edit-blog/${blog._id}" class="iconbg badge-light-success">
                <i data-feather="edit"></i><span hidden>Edit</span>
              </a>
              <form id="deleteForm_${blog._id}" action="/delete-blog/${blog._id}" method="post" style="display: none">
                <input type="hidden" name="_method" value="POST" />
                <button type="submit">Delete</button>
              </form>
              <a href="#" class="iconbg badge-light-danger" onclick="deleteBlog('${blog._id}')">
                <i data-feather="trash"></i><span hidden>Delete</span>
              </a>
            </div>
          </td>
        </tr>
      `;
    tbody.innerHTML += newRow;
  });

  feather.replace();
}

window.onload = async function () {
  const blogsResponse = await fetch('/get-blogs');
  const initialBlogs = await blogsResponse.json();
  updateBlogList(initialBlogs);
};
