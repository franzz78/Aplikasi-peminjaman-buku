Let dbPeminjaman = JSON.parse(localStorage.getItem('perpus_data')) || [];

function switchPanel(id) {
document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
document.getElementById(id).classList.add('active');
const container = document.getElementById('app-container');

if(id === 'panel-admin') {
container.classList.add('wide');
renderAdminData();
} else {
container.classList.remove('wide');
}

if(id === 'panel-form') {
document.getElementById('tgl-pinjam').value = new Date().toISOString().split('T')[0];
hitungBatas();
}

}

function hitungBatas() {
const tgl = document.getElementById('tgl-pinjam').value;
if(tgl) {
const d = new Date(tgl);
d.setDate(d.getDate() + 4);
document.getElementById('tgl-batas').value = d.toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'});
}
}

function loginAdmin() {
Swal.fire({
title: 'Akses Admin',
input: 'password',
inputPlaceholder: 'Password...',
confirmButtonColor: '#2563eb'
}).then((res) => {
if(res.value === 'SMANSALAPERPUS2026##') switchPanel('panel-admin');
else if(res.value) Swal.fire('Gagal', 'Password Salah!', 'error');
});
}

function mintaPersetujuan() {
const nama = document.getElementById('nama-peminjam').value;
const kelas = document.getElementById('kelas-peminjam').value;
const buku = document.getElementById('judul-buku').value;
const tglBatas = document.getElementById('tgl-batas').value;

if(!nama || !kelas || !buku) return Swal.fire('Data Tidak Lengkap', 'Silakan isi semua kolom.', 'warning');

dbPeminjaman.push({
id: Date.now(),
nama,
kelas,
buku,
tglBatas,
status: 'Menunggu'
});

localStorage.setItem('perpus_data', JSON.stringify(dbPeminjaman));

Swal.fire({
title: 'Terkirim!',
text: 'Silakan verifikasi ke petugas perpustakaan.',
icon: 'success'
}).then(() => {
document.getElementById('nama-peminjam').value = '';
document.getElementById('judul-buku').value = '';
switchPanel('panel-awal');
});

}

function renderAdminData() {
const list = document.getElementById('list-data');
list.innerHTML = dbPeminjaman.map((d, i) =>   <tr>   <td><b>${d.nama}</b><br>${d.kelas}</td>   <td>${d.buku}</td>   <td><span class="status-badge ${d.status === 'Menunggu' ? 'status-pending' : 'status-approved'}">${d.status}</span></td>   <td>   ${d.status === 'Menunggu' ?   <button class="btn-terima" onclick="prosesPersetujuan(${i}, 'Diterima')">Terima</button>
<button class="btn-tolak" onclick="prosesPersetujuan(${i}, 'Ditolak')">Tolak</button>:  <button class="btn-tolak" onclick="hapusData(${i})">Hapus</button>  }   </td>   </tr>  ).join('') || '<tr><td colspan="4" align="center">Tidak ada antrean pengajuan</td></tr>';
}

function prosesPersetujuan(index, aksi) {
if(aksi === 'Diterima') {
dbPeminjaman[index].status = 'Diterima';
Swal.fire('Disetujui', 'Peminjaman buku resmi dicatat.', 'success');
} else {
dbPeminjaman.splice(index, 1);
Swal.fire('Ditolak', 'Pengajuan telah dihapus.', 'error');
}
localStorage.setItem('perpus_data', JSON.stringify(dbPeminjaman));
renderAdminData();
}

function hapusData(i) {
dbPeminjaman.splice(i, 1);
localStorage.setItem('perpus_data', JSON.stringify(dbPeminjaman));
renderAdminData();
}

function hapusSemuaData() {
Swal.fire({ title: 'Hapus Semua?', icon: 'warning', showCancelButton: true }).then((res) => {
if(res.isConfirmed) { dbPeminjaman = []; localStorage.removeItem('perpus_data'); renderAdminData(); }
});
}

function exportKeExcel() {
let csv = "Nama,Kelas,Buku,Batas Kembali,Status\n" +
dbPeminjaman.map(d => ${d.nama},${d.kelas},${d.buku},${d.tglBatas},${d.status}).join("\n");
const blob = new Blob([csv], { type: 'text/csv' });
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = 'rekap_eperpus_la.csv';
a.click();
  }
